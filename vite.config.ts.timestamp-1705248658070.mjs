// vite.config.ts
import { resolve } from "path";
import { defineConfig, defaultExclude } from "file:///C:/dev/solzu/node_modules/.pnpm/vitest@0.29.8/node_modules/vitest/dist/config.js";
import dts from "file:///C:/dev/solzu/node_modules/.pnpm/vite-plugin-dts@2.1.0_@types+node@18.15.11_vite@4.2.1/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\dev\\solzu";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "solzu",
      fileName: "solzu",
      formats: ["es", "umd"]
    },
    minify: true
  },
  plugins: [dts()],
  test: {
    exclude: [...defaultExclude, "**/*@common.test.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxkZXZcXFxcc29senVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGRldlxcXFxzb2x6dVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZGV2L3NvbHp1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgZGVmYXVsdEV4Y2x1ZGUgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiO1xyXG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxyXG4gICAgICBuYW1lOiBcInNvbHp1XCIsXHJcbiAgICAgIGZpbGVOYW1lOiBcInNvbHp1XCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCIsIFwidW1kXCJdLFxyXG4gICAgfSxcclxuICAgIG1pbmlmeTogdHJ1ZSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtkdHMoKV0sXHJcbiAgdGVzdDoge1xyXG4gICAgZXhjbHVkZTogWy4uLmRlZmF1bHRFeGNsdWRlLCBcIioqLypAY29tbW9uLnRlc3QudHNcIl0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNE4sU0FBUyxlQUFlO0FBQ3BQLFNBQVMsY0FBYyxzQkFBc0I7QUFDN0MsT0FBTyxTQUFTO0FBRmhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLEdBQUcsZ0JBQWdCLHFCQUFxQjtBQUFBLEVBQ3BEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
