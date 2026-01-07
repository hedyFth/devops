const express = require("express");
const User = require("../models/User.model");

const router = express.Router();

router.get("/count", async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

module.exports = router;
