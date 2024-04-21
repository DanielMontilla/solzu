import { resolve } from "path";
import { defineConfig, defaultExclude } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "result/exclusives": resolve(__dirname, "src/result/exclusives.ts"),
        "maybe/exclusives": resolve(__dirname, "src/maybe/exclusives.ts"),
      },
      name: "solzu",
      formats: ["es", "cjs"],
      fileName: (format, name) =>
        format === "es" ? `${name}.js` : `${name}.${format}`,
    },
    minify: true,
  },
  plugins: [dts()],
  test: {
    exclude: [...defaultExclude, "**/*@common.test.ts"],
  },
});
