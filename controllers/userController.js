const User = require('../models/Users');  // Assuming you have a User model

// Controller to fetch user data based on email
const getUserByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query params

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the user in the database based on the email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's name (or other relevant data)
    return res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserByEmail };
