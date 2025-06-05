const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const profileController = require("../controllers/profileController");
const upload = require("../utils/upload");

router
  .route("/profile")
  .get(protect, profileController.getUserProfile)
  .put(protect, upload.single("image"), profileController.updateUserProfile);

router.route("/profile/:id").get(protect, profileController.getUserProfile);

module.exports = router;
