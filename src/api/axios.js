import axios from "axios";

const api = axios.create({
  baseURL: "http://72.62.78.53:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🔥 AXIOS REQUEST");
    console.log("URL:", config.url);
    console.log("TOKEN EXISTS:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "AUTH HEADER:",
      config.headers.Authorization
    );

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;