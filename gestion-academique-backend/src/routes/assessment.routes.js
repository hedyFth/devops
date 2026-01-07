const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  createAssessment,
  getAssessmentsByCourse,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessment.controller");

const router = express.Router();

// Create / Update / Delete => ADMIN or TEACHER
router.post("/", protect, authorizeRoles("ADMIN", "TEACHER"), createAssessment);
router.put("/:id", protect, authorizeRoles("ADMIN", "TEACHER"), updateAssessment);
router.delete("/:id", protect, authorizeRoles("ADMIN", "TEACHER"), deleteAssessment);

// Read => ADMIN / TEACHER / STUDENT
router.get(
  "/course/:courseId",
  protect,
  authorizeRoles("ADMIN", "TEACHER", "STUDENT"),
  getAssessmentsByCourse
);
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "TEACHER", "STUDENT"),
  getAssessmentById
);

module.exports = router;
