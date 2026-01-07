const mongoose = require("mongoose");

const USER_ROLES = ["ADMIN", "TEACHER", "STUDENT"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // ne pas renvoyer le password par défaut
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
module.exports.USER_ROLES = USER_ROLES;
