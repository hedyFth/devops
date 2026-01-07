const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized, token missing"));
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(new ApiError(401, "Not authorized, token invalid"));
  }
};

module.exports = { protect };
