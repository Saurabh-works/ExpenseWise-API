// Backend controller to handle fetching expenses for a specific week
const User = require("../models/Users");

exports.getDailySpendsController = async (req, res) => {
  const { email, year, month, week } = req.query;

  if (!email || !year || !month || !week) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the start and end date of the given week in the selected month and year
    const startOfWeek = new Date(year, month - 1, (week - 1) * 7 + 1); // The first day of the week
    const endOfWeek = new Date(year, month - 1, week * 7); // The last day of the week

    // Filter expenses that fall within the start and end date of the week
    const weeklyExpenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
    });

    // Group expenses by day
    const dailySpends = Array(7).fill(0); // 7 days in a week
    weeklyExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const dayOfWeek = expenseDate.getDay(); // Get the day of the week (0=Sunday, 1=Monday, etc.)
      dailySpends[dayOfWeek] += expense.amount;
    });

    res.status(200).json({ dailySpends, totalSpend: dailySpends.reduce((sum, amount) => sum + amount, 0) });
  } catch (error) {
    console.error("Error fetching daily spends:", error);
    res.status(500).json({ message: "Failed to fetch daily spends", error });
  }
};
