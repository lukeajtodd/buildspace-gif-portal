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
//   build: {
//     transpile: [
//       "buffer",
//       "@blocto/sdk",
//       "@ledgerhq/devices",
//       "@ledgerhq/hw-transport-webhid",
//       "@solana/wallet-adapter-base",
//       "@solana/wallet-adapter-bitkeep",
//       "@solana/wallet-adapter-bitpie",
//       "@solana/wallet-adapter-blocto",
//       "@solana/wallet-adapter-clover",
//       "@solana/wallet-adapter-coin98",
//       "@solana/wallet-adapter-coinhub",
//       "@solana/wallet-adapter-ledger",
//       "@solana/wallet-adapter-mathwallet",
//       "@solana/wallet-adapter-phantom",
//       "@solana/wallet-adapter-safepal",
//       "@solana/wallet-adapter-slope",
//       "@solana/wallet-adapter-solflare",
//       "@solana/wallet-adapter-sollet",
//       "@solana/wallet-adapter-solong",
//       "@solana/wallet-adapter-torus",
//       "@solana/wallet-adapter-vue",
//       "@solana/wallet-adapter-vue-ui",
//       "@solana/wallet-adapter-walletconnect",
//       "@solana/wallet-adapter-wallets",
//       "@solana/web3.js",
//       "@toruslabs/eccrypto",
//       "@toruslabs/openlogin",
//     ],
//   },
});
