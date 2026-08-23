import axios from "axios";

const configuredApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiBaseUrl = configuredApiUrl.replace(/\/+$/, "").endsWith("/api")
  ? configuredApiUrl.replace(/\/+$/, "")
  : `${configuredApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default api;
