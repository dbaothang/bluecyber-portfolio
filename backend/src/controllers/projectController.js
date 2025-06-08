const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const { uploadToCloudinary } = require("../utils/upload");

// @desc    Get all projects for a user
// @route   GET /api/user/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id });
  res.json(projects);
});

const getPublicProjects = asyncHandler(async (req, res) => {
  const user_id = req.params.userId;
  const projects = await Project.find({ userId: user_id });
  res.json(projects);
});

// @desc    Add a new project
// @route   POST /api/user/projects
// @access  Private
const addProject = asyncHandler(async (req, res) => {
  const { name, description, repositoryUrl, demoUrl } = req.body;
  console.log(req.file?.path);

  let imageUrl = "";
  if (req.file?.path) {
    // const result = await uploadToCloudinary(req.file.path, "project-images");
    imageUrl = req.file?.path;
  }

  const project = await Project.create({
    userId: req.user._id,
    name,
    description,
    repositoryUrl,
    demoUrl,
    image: imageUrl,
  });

  res.status(201).json(project);
});

// @desc    Update a project
// @route   PUT /api/user/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  console.log(req.file?.path);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.repositoryUrl = req.body.repositoryUrl || project.repositoryUrl;
  project.demoUrl = req.body.demoUrl || project.demoUrl;

  if (req.file?.path) {
    // const result = await uploadToCloudinary(req.file.path, "project-images");
    project.image = req.file.path;
  } else {
    project.image = "";
  }
  console.log("test");

  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/user/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ message: "Project removed" });
});

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getPublicProjects,
};
