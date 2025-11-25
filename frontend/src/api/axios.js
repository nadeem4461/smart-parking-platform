
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// attach token to every request
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default API;
