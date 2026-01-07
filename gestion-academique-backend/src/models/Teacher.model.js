const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    teacherCode: { type: String, required: true, unique: true, trim: true }, // ex: TCH-001
    specialty: { type: String, required: true, trim: true },                // ex: "Web", "Math"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
