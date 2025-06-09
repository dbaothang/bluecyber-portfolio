// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://45.77.172.27:5003/api", // baseURL chuẩn cho backend
});

export default api;
