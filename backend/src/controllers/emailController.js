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
  const { name, email, message, phone } = req.body;

  // 1. Lấy thông tin người nhận
  const targetUser = await User.findById(req.params.userId);

  // 2. Gửi email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: targetUser.email,
    subject: `New contact from ${name}`,
    html: `
      <h3>New contact request</h3>
      <p>From: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone || "Not provided"}</p>
      <p>Message: ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = {
  sendContactEmail,
};
