import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ProfileSettings = ({ user, onUpdate }) => {
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      image: null,
      removeImage: false, // Thêm trường để đánh dấu xóa ảnh
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      jobTitle: Yup.string().required("Required"),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setUploading(true);
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("jobTitle", values.jobTitle);
        formData.append("bio", values.bio);

        // Chỉ gửi image hoặc removeImage, không gửi cả hai
        if (values.image) {
          formData.append("image", values.image);
        } else if (values.removeImage) {
          formData.append("removeImage", "true");
        }

        const { data } = await axios.put("/api/user/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        // await onUpdate(data);
        setImagePreview(data.profileImage || "");
        setUploading(false);
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
      formik.setFieldValue("removeImage", false); // Đảm bảo không xóa ảnh khi chọn ảnh mới
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null);
    formik.setFieldValue("removeImage", true); // Đánh dấu xóa ảnh
    setImagePreview("");
  };

  // Reset form khi user thay đổi
  // useEffect(() => {
  //   if (user ) {
  //     formik.resetForm({
  //       values: {
  //         name: user.name || "",
  //         jobTitle: user.jobTitle || "",
  //         bio: user.bio || "",
  //         image: null,
  //         removeImage: false,
  //       },
  //     });
  //     setImagePreview(user.profileImage || "");
  //   }
  // }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-white rounded-full w-5 h-5 flex items-center justify-center text-red-500 font-bold shadow transform translate-x-1/2 -translate-y-1/2 hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            )}

            {!imagePreview && (
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
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
          className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 active:scale-95 btn-primary"
          disabled={uploading || formik.isSubmitting}
        >
          {uploading || formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
