const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide project name"],
  },
  description: {
    type: String,
    required: [true, "Please provide project description"],
  },
  repositoryUrl: {
    type: String,
    required: [true, "Please provide repository URL"],
  },
  demoUrl: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
