import { resolve } from "node:path"
import { defineConfig } from "vite"
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
      external: ["kaplay"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      insertTypesEntry: true,
    }),
  ],
})
