const nodemailer = require("nodemailer");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
  const { email, message, userId } = req.body;

  // Get user details
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const mailOptions = {
    from: email,
    to: user.email,
    subject: "New contact from your portfolio",
    text: `You have a new message from ${email}:\n\n${message}`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Email sent successfully" });
});

module.exports = {
  sendContactEmail,
};
