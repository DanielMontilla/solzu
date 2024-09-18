import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "./dist",
  entry: {
    index: "./src/index.ts",
    ["maybe/mod/index"]: "./src/maybe/mod.ts",
    ["maybe/fp/index"]: "./src/maybe/fp.ts",
    ["result/mod/index"]: "./src/result/mod.ts",
    ["result/fp/index"]: "./src/result/fp.ts",
  },
  clean: true,
  format: ["esm", "cjs"],
  minify: true,
  dts: true,
  treeshake: true,
  splitting: true,
});
