const User = require("../models/Users");

exports.getMonthlySpendsController = async (req, res) => {
  const { email, year } = req.query;

  if (!email || !year) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const spendsByMonth = Array(12).fill(0); // Initialize array for 12 months
    user.expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === parseInt(year)) {
        spendsByMonth[expenseDate.getMonth()] += expense.amount;
      }
    });

    res.status(200).json(spendsByMonth);
  } catch (error) {
    console.error("Error fetching monthly spends:", error);
    res.status(500).json({ message: "Failed to fetch monthly spends", error });
  }
};
