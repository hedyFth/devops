const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment.model");
const Student = require("../models/Student.model");
const Course = require("../models/Course.model");
const Teacher = require("../models/Teacher.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Helper function to check if teacher owns the course
const checkTeacherOwnsCourse = async (userId, courseId) => {
  const teacher = await Teacher.findOne({ user: userId });
  if (!teacher) return false;
  const course = await Course.findById(courseId);
  if (!course) return false;
  return course.teacher.toString() === teacher._id.toString();
};

// STUDENT → s’inscrire à un cours
const enrollToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) throw new ApiError(400, "courseId is required");

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId format");
  }

  const student = await Student.findOne({ user: req.user.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const enrollment = await Enrollment.create({
    student: student._id,
    course: course._id,
  });

  res.status(201).json({ success: true, enrollment });
});

// ADMIN / TEACHER → voir étudiants inscrits dans un cours
const getStudentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, courseId);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only view enrollments for your own courses");
    }
  }

  const enrollments = await Enrollment.find({ course: courseId, status: "ACTIVE" })
    .populate("student", "firstName lastName studentNumber")
    .populate("course", "title");

  res.json({
    success: true,
    count: enrollments.length,
    enrollments,
  });
});

// STUDENT → ses inscriptions
const getMyEnrollments = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const enrollments = await Enrollment.find({
    student: student._id,
    status: "ACTIVE",
  }).populate("course", "title description credits");

  res.json({ success: true, enrollments });
});

module.exports = {
  enrollToCourse,
  getStudentsByCourse,
  getMyEnrollments,
};
