import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import authStore from "../../store/authStore";

const Signup = () => {
  const navigate = useNavigate();
  const { register, loading, error } = authStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      await register(values.name, values.email, values.password);
      navigate("/portfolio");
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create an account</h1>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
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
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 active:scale-95 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
