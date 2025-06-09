import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Terminal from "vite-plugin-terminal";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(!isProduction
      ? [Terminal({ console: "terminal", output: ["terminal", "console"] })]
      : []),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://45.77.172.27:5003",
        changeOrigin: true,
      },
    },
  },
  server: {
    host: true, // Cho phép truy cập từ mọi địa chỉ IP (0.0.0.0)
    port: 5174,
    strictPort: true, // Tắt tự động chọn cổng khác nếu 5174 bị chiếm
  },
});
