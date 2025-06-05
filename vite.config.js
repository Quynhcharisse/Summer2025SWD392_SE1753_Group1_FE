import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components/shared"),
      "@pages": path.resolve(__dirname, "src/components/shared/pages"),
      "@api": path.resolve(__dirname, "src/api"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@forms": path.resolve(__dirname, "src/forms"),
      "@icons": path.resolve(__dirname, "src/icons"),
      "@queries": path.resolve(__dirname, "src/queries"),
      "@store": path.resolve(__dirname, "src/store"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@theme": path.resolve(__dirname, "src/theme"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@auth": path.resolve(__dirname, "src/auth"),
      "@organisms": path.resolve(__dirname, "src/components/shared/organisms"),
      "@atoms": path.resolve(__dirname, "src/components/shared/atoms"),
      "@services": path.resolve(__dirname, "src/api/services"),
      "@templates": path.resolve(__dirname, "src/components/shared/templates"),
      "@molecules": path.resolve(__dirname, "src/components/shared/molecules"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@config": path.resolve(__dirname, "src/config"),
    },
  },
});
