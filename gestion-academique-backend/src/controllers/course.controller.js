const mongoose = require("mongoose");
const Course = require("../models/Course.model");
const Teacher = require("../models/Teacher.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, credits, teacherId } = req.body;

  if (!title || !description || !credits || !teacherId) {
    throw new ApiError(400, "title, description, credits, teacherId are required");
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacherId format");
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const course = await Course.create({
    title,
    description,
    credits,
    teacher: teacher._id,
  });

  res.status(201).json({ success: true, course });
});

const getCourses = asyncHandler(async (req, res) => {
  let query = {};

  // If user is a TEACHER, filter courses to only show their own courses
  if (req.user.role === "TEACHER") {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      throw new ApiError(404, "Teacher profile not found");
    }
    query.teacher = teacher._id;
  }

  const courses = await Course.find(query)
    .populate("teacher", "firstName lastName teacherCode specialty")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: courses.length, courses });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "teacher",
    "firstName lastName teacherCode specialty"
  );
  if (!course) throw new ApiError(404, "Course not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      throw new ApiError(404, "Teacher profile not found");
    }
    if (course.teacher._id.toString() !== teacher._id.toString()) {
      throw new ApiError(403, "You can only view your own courses");
    }
  }

  res.json({ success: true, course });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, credits, teacherId } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  if (teacherId) {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      throw new ApiError(400, "Invalid teacherId format");
    }
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new ApiError(404, "Teacher not found");
    course.teacher = teacher._id;
  }

  course.title = title ?? course.title;
  course.description = description ?? course.description;
  course.credits = credits ?? course.credits;

  await course.save();

  res.json({ success: true, course });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  await course.deleteOne();
  res.json({ success: true, message: "Course deleted ✅" });
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
