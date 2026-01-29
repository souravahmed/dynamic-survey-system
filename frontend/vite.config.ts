import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    // Docker bind mounts can sometimes cause issues if polling isn't enabled
    watch: {
      usePolling: true,
    },
    // The Proxy configuration
    proxy: {
      // Proxy requests starting with /api
      "/api": {
        // Target is the Docker service name 'backend' defined in docker-compose.yml
        target: "http://dss_backend:3000",
        // Change the origin of the host header to the target host (important for NestJS routing)
        changeOrigin: true,
        // Optional: Rewrite the path to remove '/api' prefix if your backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
