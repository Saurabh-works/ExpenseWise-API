// controllers/expenseController.js
// const User = require("../models/User");
const User = require("../models/Users")

// Add Expense
exports.addExpense = async (req, res) => {
  const { email, date, day, category, description, amount } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.expenses.push({ date, day, category, description, amount });
    await user.save();
    res.status(201).json({ message: "Expense added successfully", expenses: user.expenses });
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense", error });
  }
};

// Get Expenses
exports.getExpenses = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
};
