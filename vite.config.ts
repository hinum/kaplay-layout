import { preview } from "@vitest/browser-preview"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "KaplayLayout",
      fileName: "index",
      formats: ["es"],
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
      // i use both because playwright doesnt support archlinux.
      // i use arch btw.
      provider: process.env.CI === "true" ? playwright() : preview(),
      instances:
        process.env.CI === "true"
          ? [{ browser: "chromium" }, { browser: "webkit" }]
          : [{ browser: "chromium" }],
      viewport: {
        width: 1280,
        height: 720,
      },
    },
  },
})
