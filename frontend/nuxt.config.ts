// https://nuxt.com/docs/api/configuration/nuxt-config
import crypto from "crypto";

if (process.env.NUXT_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2024-09-20",
  devtools: { enabled: false },
  modules: ["@sidebase/nuxt-session", "@vite-pwa/nuxt"],
  routeRules: {
    "/": { ssr: true }, // SSR
    "/login": { ssr: false }, // CSR
    "/home": { ssr: true }, // SSR
    "/typing/:id": { ssr: true }, // SSR
    "/score": { ssr: true }, // SSR
    "/analyze": { ssr: true }, // SSR
    "/ranking": { isr: 300 }, // ISR 5minutes
    "/ranking/:id": { isr: 300 }, // ISR 5minutes
    "/contact": { ssr: false }, // CSR
    "/user/setting": { ssr: false }, // CSR
    "/user/admin": { ssr: false }, // CSR
    "/privacypolicy": { ssr: true, prerender: true }, // SSG
    "/cookiepolicy": { ssr: true, prerender: true }, // SSG
    "/terms": { ssr: true, prerender: true }, // SSG
  },
  typescript: {
    shim: false,
    strict: true,
    typeCheck: false, // npx nuxi typecheckから型チェックを実行
  },
  app: {
    head: {
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true,
        },
      ],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "ja",
      },
      meta: [
        {
          name: "description",
          content:
            "Welcome to Saltype!! This is a typing practice app. | Saltypeへようこそ!! 日本語、英語でタイピングに挑戦!! ランキングで競い合おう",
        },
        {
          name: "keywords",
          content:
            "typing, practice, japanese, english, ranking | タイピング, タイピング練習, 日本語, 英語, ランキング, 競争",
        },
        { property: "og:title", content: "Saltype" },
        {
          property: "og:description",
          content: "タイピングスキルを向上させよう！",
        },
        // { property: "og:image", content: "https://ドメイン/assets/images/common/saltype-icon.png" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        // { name: "twitter:image", content: "https://ドメイン/assets/images/common/saltype-icon.png" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  runtimeConfig: {
    cookies: {
      secure: process.env.NUXT_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
    },
    cryptoKey:
      process.env.NUXT_CRYPTO_KEY || crypto.randomBytes(32).toString("hex"),
    public: {
      baseURL: process.env.NUXT_CLIENT_SIDE_URL || "http://localhost:8000",
      serverSideBaseURL:
        process.env.NUXT_SERVER_SIDE_URL || "http://django:8000",
      sentencesPath:
        process.env.NUXT_ENV === "production" ? "dist/data" : "server/data",
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
    },
  },
  vite: {
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;',
          api: "modern-compiler",
        },
      },
    },
    optimizeDeps: {
      include: [
        "vee-validate",
        "embla-carousel-vue",
        "@vueuse/core",
        "vue-chartjs",
        "chart.js",
      ],
    },
    server: {
      watch: {
        usePolling: process.env.NUXT_ENV !== "production",
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Saltype",
      short_name: "Saltype",
      theme_color: "#ffffff",
      icons: [
        {
          src: "saltype-pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "saltype-pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "saltype-pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      cleanupOutdatedCaches: true,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
