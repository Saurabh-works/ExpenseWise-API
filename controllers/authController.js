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
        <h3 style="color: #282826;">Welcome to ExpenseWise, ${name}!</h3>

<p>We're thrilled to have you on board! ExpenseWise is here to help you take control of your finances and make expense tracking a breeze.</p>

<hr style="border: 1px solid #ccc; margin: 20px 0;" />

<h4 style="color: #333;">🎉 What Can You Do with ExpenseWise?</h4>
<ul style="font-size: 10px; line-height: 1.6;">
  <li><strong>Track Your Expenses:</strong> Log and categorize your daily expenses effortlessly.</li>
  <li><strong>Visualize Your Finances:</strong> Get insights through interactive graphs and reports.</li>
  <li><strong>Set Budget Goals:</strong> Plan ahead and stay within your budget.</li>
  <li><strong>Stay Notified:</strong> Receive timely alerts for important financial activities.</li>
</ul>

<h4 style="color: #333;">✨ Getting Started</h4>
<p>Here are a few quick tips to get started:</p>
<ol style="font-size: 16px; line-height: 1.6;">
  <li>Log in to your account using the credentials you just created.</li>
  <li>Start by adding your first expense or income entry.</li>
  <li>Explore the dashboard to view detailed analytics and reports.</li>
  <li>Set up alerts to stay updated on your financial milestones.</li>
</ol>

<h4 style="color: #333;">💡 Need Help?</h4>
<p>If you ever need assistance, our support team is just an email away. Feel free to reach out to us at <a href="mailto:saurabhshindework@gmail.com">saurabhshindework@gmail.com</a>.</p>

<p style="font-size: 14px; color: #666;">Happy tracking,<br><strong>The ExpenseWise Team</strong></p>

      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        return res
          .status(500)
          .json({
            message:
              "User created, but email sending failed. Please try again later.",
          });
      }
      console.log("Email sent successfully:", info.response);
      res
        .status(201)
        .json({ message: "User created successfully and email sent!" });
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
