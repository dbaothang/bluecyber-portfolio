import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import authStore from "../../store/authStore";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword, loading, error } = authStore();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      await forgotPassword(values.email);
      setEmailSent(true);
    },
  });

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="mb-6">
          We've sent a password reset link to your email address. Please check
          your inbox.
        </p>
        <button onClick={() => navigate("/login")} className="btn-primary">
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Forgot password</h1>
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
