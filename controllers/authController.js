const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer"); // Import the transporter

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Prepare email options
    const mailOptions = {
      from: `"ExpenseWise" <saurabhshinde9637@gmail.com>`, // Your email
      to: email, // Recipient's email
      subject: "Welcome to ExpenseWise!",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for signing up with ExpenseWise.</p>
        <p>We're excited to have you on board. Start managing your expenses with ease!</p>
        <p>- The ExpenseWise Team</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        return res.status(500).json({ message: "User created, but email sending failed. Please try again later." });
      }
      console.log("Email sent successfully:", info.response);
      res.status(201).json({ message: "User created successfully and email sent!" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Signup
// exports.signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validation checks
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already exists" });

//     const newUser = new User({ name, email, password });
//     await newUser.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the entered password with the stored password (without hashing)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 
    // If login is successful, respond with a success message
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
