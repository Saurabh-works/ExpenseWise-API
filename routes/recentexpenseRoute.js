const express = require("express");
const router = express.Router();
const { getRecentExpenses } = require("../controllers/getRecentExpensesController"); // Update the path based on your project structure


// Route for fetching recent expenses
router.get("/", getRecentExpenses);

module.exports = router;
