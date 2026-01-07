const mongoose = require("mongoose");

const groupeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }, // ex: "GL5-1"
    level: { type: String, required: true, trim: true },             // ex: "5ème"
    year: { type: Number, required: true },                          
    department: { type: String, required: true, trim: true }         // ex: "Génie Logiciel"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Groupe", groupeSchema);
