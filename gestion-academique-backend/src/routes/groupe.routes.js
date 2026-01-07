const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createGroupe,
  getGroupes,
  getGroupeById,
  updateGroupe,
  deleteGroupe,
} = require("../controllers/groupe.controller");

const router = express.Router();

// ADMIN only
router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createGroupe);
router.get("/", getGroupes);
router.get("/:id", getGroupeById);
router.put("/:id", updateGroupe);
router.delete("/:id", deleteGroupe);

module.exports = router;
