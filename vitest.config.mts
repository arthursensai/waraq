import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: [
      "app/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
      "lib/**/*.{test,spec}.{ts,tsx}",
      "components/**/*.{test,spec}.{ts,tsx}",
      "handlers/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", ".next", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**", "lib/**", "handlers/**"],
      exclude: ["**/*.d.ts", "**/*.test.*", "**/components/ui/**"],
    },
  },
});
