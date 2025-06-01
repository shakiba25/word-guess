import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // به معنی گوش دادن روی همه‌ی اینترفیس‌ها (0.0.0.0)
    port: 5173, // پورت دلخواه، می‌تونی تغییر بدی
  },
});
