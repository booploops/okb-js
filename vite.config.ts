/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import { readFileSync } from "fs";
// https://vite.dev/config/

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    cssInjectedByJsPlugin(),
    dts({
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
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
      formats: ["es", "iife", "umd"],
    },
    rollupOptions: {
      // Externalize dependencies if needed
      external: [],
      shimMissingExports: true,
      output: {
        format: "esm",
        globals: {},
        banner: `/*!
 * okb-js v${pkg.version}
 * Copyright (C) 2025-Present booploops and contributors
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */`,
      },
    },
  },
});
