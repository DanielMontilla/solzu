import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "./dist",
  entry: {
    index: "./src/index.ts",
    ["maybe/index"]: "./src/primitives/maybe/scoped.ts",
    ["result/index"]: "./src/primitives/result/scoped.ts",
  },
  clean: true,
  format: ["esm", "cjs"],
  minify: true,
  dts: true,
  treeshake: true,
  splitting: true,
});
