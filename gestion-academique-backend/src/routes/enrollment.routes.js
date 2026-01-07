const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  enrollToCourse,
  getStudentsByCourse,
  getMyEnrollments,
} = require("../controllers/enrollment.controller");

const router = express.Router();

// STUDENT
router.post("/", protect, authorizeRoles("STUDENT"), enrollToCourse);
router.get("/me", protect, authorizeRoles("STUDENT"), getMyEnrollments);

// ADMIN / TEACHER
router.get(
  "/course/:courseId",
  protect,
  authorizeRoles("ADMIN", "TEACHER"),
  getStudentsByCourse
);

module.exports = router;
