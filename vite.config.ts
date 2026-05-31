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
    {
      name: "test-vite-server",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const scriptName = req.originalUrl?.match(/\/([\w_-]+)$/)?.[1]
            if (!scriptName) return next()
            const html = await server.transformIndexHtml(
              "/",
              `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
  </head>
  <body>
    <script src="tests/${scriptName}.ts" type="module"></script>
  </body>
</html>
`
            )
            res.end(html)
          })
        }
      },
    },
  ],
})
