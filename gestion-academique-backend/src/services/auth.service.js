const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const signToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const register = async ({ email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role,
  });

  const token = signToken({ id: user._id, role: user.role });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken({ id: user._id, role: user.role });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

module.exports = { register, login };