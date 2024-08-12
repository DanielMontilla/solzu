import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "./dist",
  entry: {
    index: "./src/index.ts",
    ["maybe/mod/index"]: "./src/primitives/maybe/mod.ts",
    ["maybe/fp/index"]: "./src/primitives/maybe/fp.ts",
    ["result/mod/index"]: "./src/primitives/result/mod.ts",
    ["result/fp/index"]: "./src/primitives/result/fp.ts",
  },
  clean: true,
  format: ["esm", "cjs"],
  minify: true,
  dts: true,
  treeshake: true,
  splitting: true,
});
