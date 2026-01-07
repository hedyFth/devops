const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    value: { type: Number, required: true, min: 0, max: 20 },
    attributionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// éviter double note pour même student + assessment
gradeSchema.index({ student: 1, assessment: 1 }, { unique: true });

module.exports = mongoose.model("Grade", gradeSchema);
