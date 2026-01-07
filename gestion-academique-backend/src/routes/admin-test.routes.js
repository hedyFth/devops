const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/only-admin", protect, authorizeRoles("ADMIN"), (req, res) => {
  res.json({ success: true, message: "Welcome Admin ✅" });
});

module.exports = router;
