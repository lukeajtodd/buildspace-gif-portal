import { defineNuxtConfig } from "nuxt3";
import inject from "@rollup/plugin-inject";
// import Inspect from "vite-plugin-inspect";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/css/index.css"],
  vite: {
    plugins: [
      inject({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    define: {
      global: {},
      "process.env.NODE_DEBUG": JSON.stringify(""),
    },
    optimizeDeps: {
      include: ["buffer"],
    },
  },
  ssr: false
});
