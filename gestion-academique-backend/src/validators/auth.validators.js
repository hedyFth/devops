const { body } = require("express-validator");
const { USER_ROLES } = require("../models/User.model");

const registerValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  body("role")
    .isIn(USER_ROLES)
    .withMessage(`role must be one of: ${USER_ROLES.join(", ")}`),
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("password is required"),
];

module.exports = { registerValidator, loginValidator };
