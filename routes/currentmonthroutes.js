const express = require("express");
const router = express.Router();
const {getCurrentMonthDataController} = require("../controllers/getCurrentMonthDataController");

// Route for fetching recent expenses
router.get("/", getCurrentMonthDataController);

module.exports = router;
