import { defineConfig } from 'vite'
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { resolve } from 'path';
import typescript from "@rollup/plugin-typescript";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
})
