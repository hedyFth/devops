const mongoose = require("mongoose");
const Assessment = require("../models/Assessment.model");
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

const createAssessment = asyncHandler(async (req, res) => {
  const { courseId, title, type, date, weight } = req.body;

  if (!courseId || !title || !type || !date || weight === undefined) {
    throw new ApiError(400, "courseId, title, type, date, weight are required");
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, courseId);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only create assessments for your own courses");
    }
  }

  const assessment = await Assessment.create({
    course: course._id,
    title,
    type,
    date,
    weight,
  });

  res.status(201).json({ success: true, assessment });
});

const getAssessmentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, courseId);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only view assessments for your own courses");
    }
  }

  const assessments = await Assessment.find({ course: courseId }).sort({ date: -1 });

  res.json({ success: true, count: assessments.length, assessments });
});

const getAssessmentById = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id).populate("course", "title");
  if (!assessment) throw new ApiError(404, "Assessment not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course._id);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only view assessments for your own courses");
    }
  }

  res.json({ success: true, assessment });
});

const updateAssessment = asyncHandler(async (req, res) => {
  const { title, type, date, weight } = req.body;

  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) throw new ApiError(404, "Assessment not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only update assessments for your own courses");
    }
  }

  assessment.title = title ?? assessment.title;
  assessment.type = type ?? assessment.type;
  assessment.date = date ?? assessment.date;
  assessment.weight = weight ?? assessment.weight;

  await assessment.save();

  res.json({ success: true, assessment });
});

const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) throw new ApiError(404, "Assessment not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only delete assessments for your own courses");
    }
  }

  await assessment.deleteOne();
  res.json({ success: true, message: "Assessment deleted ✅" });
});

module.exports = {
  createAssessment,
  getAssessmentsByCourse,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
};
