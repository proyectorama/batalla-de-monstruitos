import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/batalla-de-monstruitos/",
  build: {
    outDir: "docs",
  },
  plugins: [react()],
});
