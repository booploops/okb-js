import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    cssInjectedByJsPlugin(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json'
    }),
  ],
  define: {
    "process.env": {},
  },
  build: {
    lib: {
      entry: "src/main.ts", // adjust to your entry file
      name: "OKB",
      fileName: (format) => `okb.${format}.js`,
      formats: ["es", "iife"],
    },
    rollupOptions: {
      // Externalize dependencies if needed
      external: [],
      shimMissingExports: true,
      output: {
        format: "esm",
        globals: {},
      },
    },
  },
});
