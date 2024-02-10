import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/.netlify/functions/": {
        target: "http://localhost:8888", // Update with your Netlify Dev server port
        changeOrigin: true,
        rewrite: (path) => path.replace("/.netlify/functions/", ""),
      },
    },
  },
  plugins: [react()],
});
