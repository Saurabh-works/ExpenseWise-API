const cron = require("node-cron");
const transporter = require("../config/nodemailer");
const Alert = require("../models/alertModel");
const User = require("../models/Users");

// Map to keep track of scheduled jobs
const scheduledJobs = {};

// Helper to calculate date range based on alert type
const getDateRange = (type) => {
  const now = new Date();
  let start, end;

  if (type === "daily") {
    start = new Date(now.setHours(0, 0, 0, 0)); // Start of the day
    end = new Date(now.setHours(23, 59, 59, 999)); // End of the day
  } else if (type === "weekly") {
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay()) // Start of the week
    );
    start = new Date(startOfWeek.setHours(0, 0, 0, 0));
    end = new Date(start.getDate() + 6); // End of the week
  } else if (type === "monthly") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    start = new Date(startOfMonth.setHours(0, 0, 0, 0));
    end = new Date(endOfMonth.setHours(23, 59, 59, 999));
  }

  return { start, end };
};

// Schedule an alert with cron
const scheduleEmail = (alert) => {
  const [hour, minute] = alert.time.split(":").map((t) => parseInt(t, 10));

  // Create a cron expression based on alert type
  let cronExpression = `${minute} ${hour} * * *`; // Default: Daily
  if (alert.type === "weekly") {
    cronExpression = `${minute} ${hour} * * ${alert.day}`;
  } else if (alert.type === "monthly") {
    cronExpression = `${minute} ${hour} ${alert.day} * *`;
  }

  // Schedule the job
  const job = cron.schedule(cronExpression, async () => {
    try {
      const dateRange = getDateRange(alert.type);

      // Fetch user data with expenses and income
      const user = await User.findOne({ email: alert.userEmail });
      if (!user) throw new Error("User not found");

      // Filter expenses and income by date range
      const filteredExpenses = user.expenses.filter(
        (expense) =>
          expense.date >= dateRange.start && expense.date <= dateRange.end
      );
      const filteredIncome = user.income.filter(
        (income) =>
          income.date >= dateRange.start && income.date <= dateRange.end
      );

      // Calculate totals
      const totalExpense = filteredExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
      );
      const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);

      // Construct email content
      const expenseRows = filteredExpenses
        .map(
          (e) =>
            `<tr>
              <td>${new Date(e.date).toLocaleDateString()}</td>
              <td>${e.category}</td>
              <td>Expense</td>
              <td>${e.amount.toFixed(2)}</td>
            </tr>`
        )
        .join("");

      const incomeRows = filteredIncome
        .map(
          (i) =>
            `<tr>
              <td>${new Date(i.date).toLocaleDateString()}</td>
              <td>${i.category}</td>
              <td>Income</td>
              <td>${i.amount.toFixed(2)}</td>
            </tr>`
        )
        .join("");

      const emailContent = `
        <h2>${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</h2>
        <p>Here’s your expense and income summary for the selected period:</p>
        <table border="1" style="width:100%; text-align:center;">
          <thead>
            <tr><th>Date</th><th>Category</th><th>Type</th><th>Amount</th></tr>
          </thead>
          <tbody>
            ${expenseRows}
            ${incomeRows}
          </tbody>
        </table>
        <br />
        <h3>Total Summary</h3>
        <p><strong>Total Expense:</strong> ₹${totalExpense.toFixed(2)}</p>
        <p><strong>Total Income:</strong> ₹${totalIncome.toFixed(2)}</p>
      `;

      // Send email
      await transporter.sendMail({
        from: "saurabhshinde9637@gmail.com",
        to: alert.userEmail,
        subject: `Your ${alert.type} alert!`,
        html: emailContent,
      });
    } catch (err) {
      console.error("Error sending email:", err.message);
    }
  });

  // Save the job in the scheduledJobs map
  scheduledJobs[alert._id.toString()] = job;
};

// Load alerts on server start
const initializeAlerts = async () => {
  const alerts = await Alert.find();
  alerts.forEach((alert) => scheduleEmail(alert));
};

// Get alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userEmail: req.query.userEmail });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAlert = async (req, res) => {
  const { userEmail, type, time, day } = req.body;
  try {
    const alert = await Alert.create({ userEmail, type, time, day });
    scheduleEmail(alert);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAlert = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Alert.findByIdAndDelete(id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    const job = scheduledJobs[id];
    if (job) {
      job.stop();
      delete scheduledJobs[id];
    }

    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Final export
console.log("Exporting controller functions...");
module.exports = { initializeAlerts, getAlerts, createAlert, deleteAlert };