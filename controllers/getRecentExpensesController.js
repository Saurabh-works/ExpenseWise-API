const User = require("../models/Users");

exports.getRecentExpenses = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all expenses and sort them by date (most recent first)
    const sortedExpenses = user.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get the last 5 transactions
    const recentExpenses = sortedExpenses.slice(0, 5);

    res.status(200).json(recentExpenses);
  } catch (error) {
    console.error("Error fetching recent expenses:", error);
    res.status(500).json({ message: "Failed to fetch recent expenses", error });
  }
};
