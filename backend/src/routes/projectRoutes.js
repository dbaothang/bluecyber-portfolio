const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const projectController = require("../controllers/projectController");
const upload = require("../utils/upload");

router
  .route("/projects")
  .get(protect, projectController.getProjects)
  .post(protect, upload.single("image"), projectController.addProject);

router
  .route("/projects/:userId")
  .get(projectController.getPublicProjects)
  .put(protect, upload.single("image"), projectController.updateProject)
  .delete(protect, projectController.deleteProject);

module.exports = router;
