const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const router = express.Router();

// Lecture: ADMIN/TEACHER/STUDENT
router.get("/", protect, authorizeRoles("ADMIN", "TEACHER", "STUDENT"), getCourses);
router.get("/:id", protect, authorizeRoles("ADMIN", "TEACHER", "STUDENT"), getCourseById);

// Admin only: Create/Update/Delete
router.post("/", protect, authorizeRoles("ADMIN"), createCourse);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateCourse);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteCourse);

module.exports = router;
