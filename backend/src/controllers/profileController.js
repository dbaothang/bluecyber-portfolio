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

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.jobTitle = req.body.jobTitle || user.jobTitle;
    user.bio = req.body.bio || user.bio;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "profile-images");
      user.profileImage = result.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      jobTitle: updatedUser.jobTitle,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
};
