const Student = require("../models/Student.model");
const User = require("../models/User.model");
const Groupe = require("../models/Groupe.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");

/**
 * ADMIN creates a student:
 * - creates User (role STUDENT)
 * - creates Student profile
 */
const createStudent = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, studentNumber, groupeId } =
    req.body;

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !studentNumber ||
    !groupeId
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const groupe = await Groupe.findById(groupeId);
  if (!groupe) throw new ApiError(404, "Groupe not found");

  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(409, "Email already exists");

  const studentExists = await Student.findOne({ studentNumber });
  if (studentExists) throw new ApiError(409, "Student number already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role: "STUDENT",
  });

  const student = await Student.create({
    user: user._id,
    firstName,
    lastName,
    studentNumber,
    groupe: groupe._id,
  });

  res.status(201).json({
    success: true,
    student,
  });
});

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .populate("user", "email role")
    .populate("groupe", "name level");

  res.json({ success: true, count: students.length, students });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "email role")
    .populate("groupe", "name level");

  if (!student) throw new ApiError(404, "Student not found");

  res.json({ success: true, student });
});

const updateStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, groupeId } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");

  if (groupeId) {
    const groupe = await Groupe.findById(groupeId);
    if (!groupe) throw new ApiError(404, "Groupe not found");
    student.groupe = groupe._id;
  }

  student.firstName = firstName ?? student.firstName;
  student.lastName = lastName ?? student.lastName;

  await student.save();

  res.json({ success: true, student });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");

  await User.findByIdAndDelete(student.user);
  await student.deleteOne();

  res.json({ success: true, message: "Student deleted ✅" });
});

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
