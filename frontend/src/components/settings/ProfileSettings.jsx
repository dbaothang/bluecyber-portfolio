import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ProfileSettings = ({ user, onUpdate }) => {
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      jobTitle: Yup.string().required("Required"),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        let imageUrl = user?.profileImage || "";

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

        const updatedUser = {
          ...values,
          profileImage: imageUrl,
        };

        await onUpdate(updatedUser);
      } catch (error) {
        console.error("Error updating profile:", error);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
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
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="input-field"
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
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            className="input-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.jobTitle}
          />
          {formik.touched.jobTitle && formik.errors.jobTitle ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.jobTitle}
            </div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            className="input-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
          />
          {formik.touched.bio && formik.errors.bio ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.bio}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={uploading || formik.isSubmitting}
        >
          {uploading || formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
