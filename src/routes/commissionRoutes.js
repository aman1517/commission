const express = require("express");
const router = express.Router();
const {
  getCommissions,
  createCommission,
  updateCommission,
  deleteCommission
} = require("../controllers/commissionController");

// Routes
router.get("/", getCommissions);
router.post("/", createCommission);
router.patch("/:id", updateCommission);
router.delete("/:id", deleteCommission);

module.exports = router;
