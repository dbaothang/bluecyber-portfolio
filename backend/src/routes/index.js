const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const projectRoutes = require("./projectRoutes");
const emailController = require("../controllers/emailController");

router.use("/user", authRoutes);
router.use("/user", profileRoutes);
router.use("/user", projectRoutes);
router.post("/contact", emailController.sendContactEmail);

module.exports = router;
