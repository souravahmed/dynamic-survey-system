import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Docker bind mounts can sometimes cause issues if polling isn't enabled
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      // Maps "@" to the "src" directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
