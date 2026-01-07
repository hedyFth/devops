const Teacher = require("../models/Teacher.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");

const createTeacher = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, teacherCode, specialty } =
    req.body;

  if (!email || !password || !firstName || !lastName || !teacherCode || !specialty) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(409, "Email already exists");

  const teacherExists = await Teacher.findOne({ teacherCode });
  if (teacherExists) throw new ApiError(409, "Teacher code already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role: "TEACHER",
  });

  const teacher = await Teacher.create({
    user: user._id,
    firstName,
    lastName,
    teacherCode,
    specialty,
  });

  res.status(201).json({ success: true, teacher });
});

const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()
    .populate("user", "email role")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: teachers.length, teachers });
});

const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate(
    "user",
    "email role"
  );
  if (!teacher) throw new ApiError(404, "Teacher not found");
  res.json({ success: true, teacher });
});

const updateTeacher = asyncHandler(async (req, res) => {
  const { firstName, lastName, specialty } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  teacher.firstName = firstName ?? teacher.firstName;
  teacher.lastName = lastName ?? teacher.lastName;
  teacher.specialty = specialty ?? teacher.specialty;

  await teacher.save();

  res.json({ success: true, teacher });
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  await User.findByIdAndDelete(teacher.user);
  await teacher.deleteOne();

  res.json({ success: true, message: "Teacher deleted ✅" });
});

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
