import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ProjectSettings = ({ projects, onAddProject, onUpdateProject }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: editingProject?.name || "",
      description: editingProject?.description || "",
      repositoryUrl: editingProject?.repositoryUrl || "",
      demoUrl: editingProject?.demoUrl || "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      repositoryUrl: Yup.string()
        .url("Must be a valid URL")
        .required("Required"),
      demoUrl: Yup.string().url("Must be a valid URL"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        let imageUrl = editingProject?.image || "";

        if (values.image) {
          setUploading(true);
          const formData = new FormData();
          formData.append("image", values.image);

          const { data } = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrl = data.secure_url;
          setUploading(false);
        }

        const projectData = {
          ...values,
          image: imageUrl,
        };

        if (editingProject) {
          await onUpdateProject(editingProject._id, projectData);
        } else {
          await onAddProject(projectData);
        }

        resetForm();
        setEditingProject(null);
        setImagePreview("");
      } catch (error) {
        console.error("Error saving project:", error);
        setUploading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    formik.setValues({
      name: project.name,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl || "",
      image: null,
    });
    setImagePreview(project.image || "");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Projects Settings</h2>

      <form onSubmit={formik.handleSubmit} className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {editingProject ? "Edit Project" : "+ Add Project"}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div>
              <input
                type="file"
                id="projectImage"
                name="projectImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="projectImage"
                className="inline-block px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Image must be PNG or JPEG - max 2MB
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="input-field"
            placeholder="Enter your project name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="repositoryUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Repository URL
          </label>
          <input
            id="repositoryUrl"
            name="repositoryUrl"
            type="url"
            className="input-field"
            placeholder="Enter the repository URL"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.repositoryUrl}
          />
          {formik.touched.repositoryUrl && formik.errors.repositoryUrl ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.repositoryUrl}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="input-field"
            placeholder="Enter a short description.."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            htmlFor="demoUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Demo URL
          </label>
          <input
            id="demoUrl"
            name="demoUrl"
            type="url"
            className="input-field"
            placeholder="Enter the demo URL"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.demoUrl}
          />
          {formik.touched.demoUrl && formik.errors.demoUrl ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.demoUrl}
            </div>
          ) : null}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={uploading || formik.isSubmitting}
          >
            {uploading || formik.isSubmitting
              ? editingProject
                ? "Updating..."
                : "Adding..."
              : editingProject
              ? "Update Project"
              : "Add Project"}
          </button>

          {editingProject && (
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                formik.resetForm();
                setImagePreview("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Your Projects</h3>

        {projects.length === 0 ? (
          <p className="text-gray-500">You haven't added any projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEditProject(project)}
                  className="text-primary hover:text-primary-dark"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettings;
