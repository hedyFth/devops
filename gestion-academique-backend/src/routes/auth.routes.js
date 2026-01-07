const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validators");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

module.exports = router;
