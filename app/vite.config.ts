import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // Relative base so the build works when served from a subpath
  // (e.g. GitHub Pages served from the /docs folder: https://<user>.github.io/<repo>/).
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Build straight into the repository-root /docs folder.
    outDir: path.resolve(__dirname, "../docs"),
    emptyOutDir: true,
  },
});
