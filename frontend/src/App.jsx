import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import PortfolioPage from "./pages/PortfolioPage";
import SettingsPage from "./pages/SettingsPage";
import authStore from "./store/authStore";

const App = () => {
  const location = useLocation();
  const { isAuthenticated, loading, loadUser } = authStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Danh sách route không yêu cầu auth
  const publicRoutes = [
    "/",
    "/auth",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        {/* Route public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Route protected */}
        <Route path="/portfolio/:userId" element={<PortfolioPage />} />{" "}
        {/* Public route */}
        <Route
          path="/portfolio"
          element={
            isAuthenticated ? (
              <PortfolioPage />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <SettingsPage />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
