import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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

    // ==========================================
    // FORM DATA / FILE UPLOAD
    // ==========================================

    if (config.data instanceof FormData) {
      // Remove JSON content type.
      // Browser will automatically create:
      // multipart/form-data; boundary=....
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];

      console.log("📎 FORM DATA REQUEST");
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    console.log(
      "AUTH HEADER:",
      config.headers.Authorization
    );

    console.log(
      "IS FORMDATA:",
      config.data instanceof FormData
    );

    console.log(
      "CONTENT TYPE:",
      config.headers["Content-Type"]
    );

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;