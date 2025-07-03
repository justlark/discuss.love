import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cloudflare()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // When running in dev mode, you can spin up a local instance of the
      // Cloudflare Worker like this:
      //
      // ```
      // cd ./worker
      // npx wrangler dev
      // ```
      "/api": {
        target: "http://localhost:8787",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
