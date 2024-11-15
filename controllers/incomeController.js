// controllers/incomeController.js
const User = require("../models/Users");

// Add Income
exports.addIncome = async (req, res) => {
  const { email, date, day, category, description, amount } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.income.push({ date, day, category, description, amount });
    await user.save();
    res.status(201).json({ message: "Income added successfully", income: user.income });
  } catch (error) {
    res.status(500).json({ message: "Failed to add income", error });
  }
};

// Get Income
exports.getIncome = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.income);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch income", error });
  }
};
