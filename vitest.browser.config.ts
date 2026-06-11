import { defineConfig } from "vitest/config"
import { preview } from "@vitest/browser-preview"

export default defineConfig({
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
