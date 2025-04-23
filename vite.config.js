import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  tailwindcss: {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          nunito: ["Nunito", "sans-serif"],
        },
      },
    },
  },
  server: {
    proxy: {
      '/storage': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) =>path.replace(/^\/v0/, "/v0"),
      },
    },
  },
});