const Groupe = require("../models/Groupe.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createGroupe = asyncHandler(async (req, res) => {
  const { name, level, year, department } = req.body;

  if (!name || !level || !year || !department) {
    throw new ApiError(400, "name, level, year, department are required");
  }

  const exists = await Groupe.findOne({ name });
  if (exists) throw new ApiError(409, "Groupe name already exists");

  const groupe = await Groupe.create({ name, level, year, department });

  res.status(201).json({ success: true, groupe });
});

const getGroupes = asyncHandler(async (req, res) => {
  const groupes = await Groupe.find().sort({ createdAt: -1 });
  res.json({ success: true, count: groupes.length, groupes });
});

const getGroupeById = asyncHandler(async (req, res) => {
  const groupe = await Groupe.findById(req.params.id);
  if (!groupe) throw new ApiError(404, "Groupe not found");
  res.json({ success: true, groupe });
});

const updateGroupe = asyncHandler(async (req, res) => {
  const { name, level, year, department } = req.body;

  const groupe = await Groupe.findById(req.params.id);
  if (!groupe) throw new ApiError(404, "Groupe not found");

  if (name && name !== groupe.name) {
    const exists = await Groupe.findOne({ name });
    if (exists) throw new ApiError(409, "Groupe name already exists");
  }

  groupe.name = name ?? groupe.name;
  groupe.level = level ?? groupe.level;
  groupe.year = year ?? groupe.year;
  groupe.department = department ?? groupe.department;

  await groupe.save();

  res.json({ success: true, groupe });
});

const deleteGroupe = asyncHandler(async (req, res) => {
  const groupe = await Groupe.findById(req.params.id);
  if (!groupe) throw new ApiError(404, "Groupe not found");

  await groupe.deleteOne();
  res.json({ success: true, message: "Groupe deleted ✅" });
});

module.exports = {
  createGroupe,
  getGroupes,
  getGroupeById,
  updateGroupe,
  deleteGroupe,
};
