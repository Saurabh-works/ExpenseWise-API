const User = require("../models/Users");

// Get Report Data
exports.getReport = async (req, res) => {
    const { email, month, type } = req.query;
    console.log("Fetching report for:", { email, month, type });
  
    if (!email || !month || !type) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.error("User not found for email:", email);
        return res.status(404).json({ message: "User not found" });
      }
  
      const monthIndex = parseInt(month) - 1; // Convert month to 0-based index
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return res.status(400).json({ message: "Invalid month value" });
      }
  
      const filteredData = user[type]?.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === monthIndex;
      });
  
      console.log("Filtered Data:", filteredData);
      res.status(200).json(filteredData);
    } catch (error) {
      console.error("Error in getReport controller:", error);
      res.status(500).json({ message: "Failed to fetch report data", error });
    }
  };
