const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const protectedRoutes = require("./protected.routes");
const adminTestRoutes = require("./admin-test.routes");
const groupeRoutes = require("./groupe.routes");
const studentRoutes = require("./student.routes");
const teacherRoutes = require("./teacher.routes");
const courseRoutes = require("./course.routes");
const enrollmentRoutes = require("./enrollment.routes");
const assessmentRoutes = require("./assessment.routes");
const gradeRoutes = require("./grade.routes");


router.get("/", (req, res) => {
  res.json({ message: "API root ✅" });
});

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/admin-test", adminTestRoutes);
router.use("/groupes", groupeRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/grades", gradeRoutes);









module.exports = router;
