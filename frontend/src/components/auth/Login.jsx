import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiGithub } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import authStore from "../../store/authStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = authStore();

  // Lấy trang trước đó từ state hoặc mặc định là '/portfolio'
  // const from = location.state?.from?.pathname || "/portfolio";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const user = await login(values.email, values.password); // Đảm bảo hàm login trả về user
      console.log(user);
      if (user) {
        const redirectPath =
          location.state?.from?.pathname || `/portfolio/${user}`;
        navigate(redirectPath, { replace: true });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login to account</h1>
      <p className="text-gray-600 text-center mb-6">
        Enter your credentials to access your account
      </p>

      <button className="w-full flex items-center justify-center gap-2 btn-secondary mb-4">
        <FiGithub className="text-lg" />
        Sign in with Github
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        {/* Giữ nguyên phần form fields */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
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
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 input-field"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 active:scale-95 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-600">Not a member? </span>
        <Link to="/signup" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
