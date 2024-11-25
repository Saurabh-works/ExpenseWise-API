const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Email from localStorage
  type: { type: String, required: true },      // daily, weekly, monthly
  time: { type: String, required: true },      // Format: HH:mm
  day: { type: String, required: false },      // Day of week/month
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Alert", alertSchema);
