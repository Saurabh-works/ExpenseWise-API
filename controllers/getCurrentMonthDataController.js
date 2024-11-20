const User = require("../models/Users");

exports.getCurrentMonthDataController = async (req, res) => {
  const { email, year, month } = req.query;

  if (!email || !year || !month) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === parseInt(year) && expenseDate.getMonth() + 1 === parseInt(month);
    });

    const income = user.income.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate.getFullYear() === parseInt(year) && incomeDate.getMonth() + 1 === parseInt(month);
    });

    res.status(200).json({ expenses, income });
  } catch (error) {
    console.error("Error fetching current month data:", error);
    res.status(500).json({ message: "Failed to fetch current month data", error });
  }
};
