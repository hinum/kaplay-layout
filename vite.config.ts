import { preview } from "@vitest/browser-preview"
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "KaplayLayout",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["kaplay", /yoga-layout/],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      exclude: "./tests",
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["./tests/**/*.ts"],
    exclude: ["./tests/lib"],
    browser: {
      enabled: true,
      provider: preview(),
      instances: [{ browser: "chrome" }],
      viewport: {
        width: 1280,
        height: 720,
      },
    },
  },
})
