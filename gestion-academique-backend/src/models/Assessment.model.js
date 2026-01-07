const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true, trim: true },     // "DS1"
    type: { type: String, required: true, trim: true },      // "DS" | "EXAM" | "TP" ...
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 0, max: 1 }, // ex: 0.3
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
