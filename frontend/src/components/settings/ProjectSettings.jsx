import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./../../api";

const ProjectSettings = ({ onAddProject, onUpdateProject }) => {
  const queryClient = useQueryClient();
  const [currentImage, setCurrentImage] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  // ✅ React Query v5: dùng object
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/user/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const formik = useFormik({
    initialValues: {
      name: editingProject?.name || "",
      description: editingProject?.description || "",
      repositoryUrl: editingProject?.repositoryUrl || "",
      demoUrl: editingProject?.demoUrl || "",
      image: null,
    },
    enableReinitialize: true, // ✅ để cập nhật lại initialValues khi editingProject thay đổi
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
        setUploading(true);
        const formData = new FormData();
        if (values.image) {
          formData.append("image", values.image);
        }
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("repositoryUrl", values.repositoryUrl);
        formData.append("demoUrl", values.demoUrl || "");

        const { data } = editingProject
          ? await api.put(`/user/projects/${editingProject._id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            })
          : await api.post("/user/projects", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            });

        // ✅ Cập nhật cache local ngay
        queryClient.setQueryData({ queryKey: ["projects"] }, (old = []) => {
          return editingProject
            ? old.map((proj) => (proj._id === data._id ? data : proj))
            : [...old, data];
        });

        // ✅ Reset form
        resetForm();
        setImagePreview("");
        setCurrentImage("");
        setEditingProject(null);

        // ✅ Refetch lại server
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } catch (error) {
        console.error("Error saving project:", error);
      } finally {
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
    setCurrentImage(project.image || "");
    setImagePreview("");
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // ✅ Tối ưu UI
        queryClient.setQueryData({ queryKey: ["projects"] }, (old) =>
          old ? old.filter((p) => p._id !== projectId) : []
        );

        // ✅ Gọi API
        await api.delete(`/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Sync lại server
        await queryClient.invalidateQueries({ queryKey: ["projects"] });

        // ✅ Nếu đang edit project bị xóa
        if (editingProject?._id === projectId) {
          setEditingProject(null);
          formik.resetForm();
          setImagePreview("");
          setCurrentImage("");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    }
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
            {(imagePreview || currentImage) && (
              <div className="relative">
                <img
                  src={imagePreview || currentImage}
                  alt={imagePreview ? "New preview" : "Current project"}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (imagePreview) {
                      setImagePreview("");
                      formik.setFieldValue("image", null);
                    } else {
                      setCurrentImage("");
                      // Nếu đang edit, cần xóa cả ảnh hiện tại
                      if (editingProject) {
                        formik.setFieldValue("image", null); // Đánh dấu để xóa ảnh
                      }
                    }
                  }}
                  className="absolute top-0 right-0 bg-white rounded-full w-5 h-5 flex items-center justify-center text-red-500 font-bold shadow transform translate-x-1/2 -translate-y-1/2 hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            )}
            {!(imagePreview || currentImage) && (
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
                {imagePreview || currentImage ? "Change Image" : "Upload Image"}
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 active:scale-95 btn-primary"
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
                setCurrentImage("");
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
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Phần thông tin project bên trái */}
                <div className="flex-1 mr-6">
                  <h4 className="font-semibold text-lg">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {project.description}
                  </p>
                </div>

                {/* Nhóm nút bên phải */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1 rounded-md text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1 rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettings;
