const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailTemplates");
const { uploadToCloudinary } = require("../utils/upload");

// @desc    Register a new user
// @route   POST /api/user/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Send verification email
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await sendVerificationEmail(user.email, token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.correctPassword(password, user.password))) {
    res.json({
      // _id: user._id,
      // name: user.name,
      // email: user.email,
      // jobTitle: user.jobTitle,
      // bio: user.bio,
      // profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Forgot password - send reset email
// @route   POST /api/user/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate reset token
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Save token to database
  await PasswordResetToken.create({
    userId: user._id,
    token: resetToken,
  });

  // Send email
  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: "Password reset email sent" });
});

// @desc    Reset password
// @route   POST /api/user/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { token, password } = req.body;

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if token exists in database
  const resetToken = await PasswordResetToken.findOne({
    userId: decoded.id,
    token,
  });

  if (!resetToken) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  // Update user password
  const user = await User.findById(decoded.id);
  user.password = password;
  await user.save();

  // Delete the token
  await PasswordResetToken.deleteOne({ token });

  res.status(200).json({ message: "Password reset successfully" });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
