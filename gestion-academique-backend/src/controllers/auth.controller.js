
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

/**
 * POST /api/auth/register
 * Body validated by validators (auth.validators.js)
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const result = await authService.register({ email, password, role });

  res.status(201).json({
    success: true,
    message: "Register success",
    ...result,
  });
});

/**
 * POST /api/auth/login
 * Body validated by validators (auth.validators.js)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.json({
    success: true,
    message: "Login success",
    ...result,
  });
});

module.exports = { register, login };
