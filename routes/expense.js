// routes/expense.js
const express = require("express");
const { addExpense, getExpenses } = require("../controllers/expenseController");
const router = express.Router();

router.post("/add", addExpense);
router.get("/", getExpenses);

module.exports = router;
