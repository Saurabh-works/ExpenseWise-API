const express = require("express");
const { getAlerts, createAlert, deleteAlert } = require("../controllers/alertController");

const router = express.Router();

// Get all alerts for a user
router.get("/", getAlerts);

// Schedule a new alert
router.post("/", createAlert);

// Delete an alert
router.delete("/:id", deleteAlert);

module.exports = router;
