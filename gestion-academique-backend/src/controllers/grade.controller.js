const mongoose = require("mongoose");
const Grade = require("../models/Grade.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");
const Assessment = require("../models/Assessment.model");
const Course = require("../models/Course.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// helper: get teacher profile from logged user
const getTeacherProfile = async (userId) => {
  return Teacher.findOne({ user: userId });
};

// Helper function to check if teacher owns the course
const checkTeacherOwnsCourse = async (userId, courseId) => {
  const teacher = await Teacher.findOne({ user: userId });
  if (!teacher) return false;
  const course = await Course.findById(courseId);
  if (!course) return false;
  return course.teacher.toString() === teacher._id.toString();
};

// TEACHER/ADMIN -> create grade
const createGrade = asyncHandler(async (req, res) => {
  const { studentId, assessmentId, value } = req.body;

  if (!studentId || !assessmentId || value === undefined) {
    throw new ApiError(400, "studentId, assessmentId, value are required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(studentId) ||
    !mongoose.Types.ObjectId.isValid(assessmentId)
  ) {
    throw new ApiError(400, "Invalid studentId or assessmentId");
  }

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) throw new ApiError(404, "Assessment not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only create grades for assessments in your own courses");
    }
  }

  // Determine teacher: if ADMIN we still need teacherId explicitly OR pick from token teacher
  let teacher = await getTeacherProfile(req.user.id);

  // If request comes from ADMIN, he doesn't have teacher profile normally
  // In that case, require teacherId in body
  if (!teacher && req.user.role === "ADMIN") {
    const { teacherId } = req.body;
    if (!teacherId) {
      throw new ApiError(400, "teacherId is required when role is ADMIN");
    }
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      throw new ApiError(400, "Invalid teacherId");
    }
    teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new ApiError(404, "Teacher not found");
  }

  if (!teacher) throw new ApiError(403, "Teacher profile not found");

  const grade = await Grade.create({
    student: student._id,
    assessment: assessment._id,
    teacher: teacher._id,
    value,
  });

  res.status(201).json({ success: true, grade });
});

// TEACHER/ADMIN -> list grades of an assessment
const getGradesByAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    throw new ApiError(400, "Invalid assessmentId");
  }

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) throw new ApiError(404, "Assessment not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only view grades for assessments in your own courses");
    }
  }

  const grades = await Grade.find({ assessment: assessmentId })
    .populate("student", "firstName lastName studentNumber")
    .populate("assessment", "title type")
    .populate("teacher", "firstName lastName teacherCode");

  res.json({ success: true, count: grades.length, grades });
});

// TEACHER/ADMIN -> update grade
const updateGrade = asyncHandler(async (req, res) => {
  const { value } = req.body;

  const grade = await Grade.findById(req.params.id);
  if (!grade) throw new ApiError(404, "Grade not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const assessment = await Assessment.findById(grade.assessment);
    if (!assessment) throw new ApiError(404, "Assessment not found");
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only update grades for assessments in your own courses");
    }
  }

  if (value !== undefined) grade.value = value;

  await grade.save();
  res.json({ success: true, grade });
});

// TEACHER/ADMIN -> delete grade
const deleteGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findById(req.params.id);
  if (!grade) throw new ApiError(404, "Grade not found");

  // If user is a TEACHER, verify they own the course
  if (req.user.role === "TEACHER") {
    const assessment = await Assessment.findById(grade.assessment);
    if (!assessment) throw new ApiError(404, "Assessment not found");
    const ownsCourse = await checkTeacherOwnsCourse(req.user.id, assessment.course);
    if (!ownsCourse) {
      throw new ApiError(403, "You can only delete grades for assessments in your own courses");
    }
  }

  await grade.deleteOne();
  res.json({ success: true, message: "Grade deleted ✅" });
});
// STUDENT -> voir ses notes
const getMyGrades = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const grades = await Grade.find({ student: student._id })
    .populate({
      path: "assessment",
      select: "title type weight",
      populate: { path: "course", select: "title credits" },
    })
    .populate("teacher", "firstName lastName teacherCode");

  res.json({
    success: true,
    count: grades.length,
    grades,
  });
});


module.exports = {
  createGrade,
  getGradesByAssessment,
  updateGrade,
  deleteGrade,
  getMyGrades,
};
