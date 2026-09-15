import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://72.62.78.53:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});