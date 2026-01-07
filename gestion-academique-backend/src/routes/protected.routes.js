const express = require("express");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated ✅",
    user: req.user,
  });
});

module.exports = router;
