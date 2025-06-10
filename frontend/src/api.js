// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://66.42.56.232:5003/api", // baseURL chuẩn cho backend
});

export default api;
