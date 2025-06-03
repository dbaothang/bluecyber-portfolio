import { create } from "zustand";
import axios from "axios";

const authStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      set({ user: data, isAuthenticated: true, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      set({ user: data, isAuthenticated: true, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("userInfo");
    set({ user: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await axios.post("/api/user/forgot-password", { email });
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
      await axios.post("/api/user/reset-password", { token, password });
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  loadUser: () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      set({ user: JSON.parse(userInfo), isAuthenticated: true });
    }
  },
}));

export default authStore;
