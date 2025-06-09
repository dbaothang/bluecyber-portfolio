import { create } from "zustand";
import api from "./../api"; // dùng file axios riêng

const authStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/user/login", { email, password });
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data._id;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return null;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/user/signup", { name, email, password });
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await api.post("/user/forgot-password", { email });
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  resetPassword: async (token, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/user/reset-password", { token, password });
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  loadUser: async () => {
    set({ loading: true });
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const { data } = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        user: data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default authStore;
