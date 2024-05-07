import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "primitives/result/scoped": resolve(
          __dirname,
          "src/primitives/result/scoped.ts"
        ),
        "primitives/maybe/scoped": resolve(
          __dirname,
          "src/primitives/maybe/scoped.ts"
        ),
      },
      name: "solzu",
      formats: ["es", "cjs"],
      fileName: (format, name) =>
        format === "es" ? `${name}.js` : `${name}.${format}`,
    },
    minify: true,
  },
  plugins: [dts()],
});
