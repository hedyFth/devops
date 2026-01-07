const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  createGrade,
  getGradesByAssessment,
  updateGrade,
  deleteGrade,
  getMyGrades,
  getGradesByCourse,
} = require("../controllers/grade.controller");



const router = express.Router();

// STUDENT
router.get(
  "/me",
  protect,
  authorizeRoles("STUDENT"),
  getMyGrades
);

// TEACHER / ADMIN
router.post("/", protect, authorizeRoles("TEACHER", "ADMIN"), createGrade);
router.get(
  "/assessment/:assessmentId",
  protect,
  authorizeRoles("TEACHER", "ADMIN"),
  getGradesByAssessment
);
router.put("/:id", protect, authorizeRoles("TEACHER", "ADMIN"), updateGrade);
router.delete("/:id", protect, authorizeRoles("TEACHER", "ADMIN"), deleteGrade);

module.exports = router;
