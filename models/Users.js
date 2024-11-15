// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// module.exports = mongoose.model('User', userSchema);


// models/User.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  day: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const incomeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  day: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  expenses: [expenseSchema], // Array of expense objects
  income: [incomeSchema], // Array of income objects
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
