const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saurabhshinde9637@gmail.com", // Environment variable for security
    pass: "cqmv tckq byxb oyyo",
  },
});

module.exports = transporter;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email", // SMTP server for Ethereal
//   port: 587, // Port number
//   secure: false, // Use TLS for this port
//   auth: {
//     user: "bill.mclaughlin@ethereal.email", // Ethereal email address
//     pass: "vftHNE9jdmeFE77QFv", // Ethereal email password
//   },
// });

// module.exports = transporter;


  
