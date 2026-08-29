import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root,
  base: process.env.BASE_PATH ?? "/",
  server: { host: "0.0.0.0", port: Number(process.env.PORT ?? 4174) },
  build: { outDir: path.join(root, "dist"), emptyOutDir: true }
});
