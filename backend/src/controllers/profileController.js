const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { uploadToCloudinary } = require("../utils/upload");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Kiểm tra nếu userId không hợp lệ

  const user = await User.findById(userId).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields from req.body
  user.name = req.body.name;
  user.jobTitle = req.body.jobTitle;
  user.bio = req.body.bio;

  // Update image if provided
  if (req.file?.path) {
    user.profileImage = req.file.path; // Use Cloudinary URL directly
    console.log("oke");
  } else {
    console.log("access");
    user.profileImage = ""; // Keep the existing image
  }
  // } else {
  //   console.log("access2");
  //   user.profileImage = "";
  // }
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    jobTitle: updatedUser.jobTitle,
    bio: updatedUser.bio,
    profileImage: updatedUser.profileImage,
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
};
