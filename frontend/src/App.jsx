import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PortfolioPage from "./pages/PortfolioPage";
import SettingsPage from "./pages/SettingsPage";
import authStore from "./store/authStore";

const App = () => {
  const { isAuthenticated, loadUser } = authStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/portfolio/:userId" element={<PortfolioPage />} />
        <Route
          path="/portfolio"
          element={
            isAuthenticated ? <PortfolioPage /> : <Navigate to="/auth/login" />
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? <SettingsPage /> : <Navigate to="/auth/login" />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
