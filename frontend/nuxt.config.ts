// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2024-09-20",
  devtools: { enabled: false },
  modules: ["@sidebase/nuxt-session", "@vite-pwa/nuxt"],
  routeRules: {
    "/": { ssr: true, prerender: true }, // SSR
    "/login": { ssr: false }, // CSR
    "/home": { ssr: false }, // SSR
    "/typing/:id": { ssr: true }, // SSR
    "/typing/ai": { ssr: true }, // SSR
    "/score": { ssr: true }, // SSR
    "/analyze": { ssr: true }, // SSR
    "/ranking": { isr: 300 }, // ISR 5minutes
    "/ranking/:id": { isr: 300 }, // ISR 5minutes
    "/contact": { ssr: false }, // CSR
    "/settings/screen": {
      ssr: false,
      prerender: false,
    },
    "/settings/user": { ssr: false }, // CSR
    "/settings/password/forgot": { ssr: false }, // CSR
    "/settings/password/reset": { ssr: false }, // CSR
    "/admin": { ssr: false }, // CSR
    "/privacypolicy": {
      ssr: false,
      static: true,
    },
    "/cookiepolicy": {
      ssr: false,
      static: true,
    },
    "/terms": {
      ssr: false,
      static: true,
    },
    "/error": {
      ssr: true,
      static: true,
    },
    "/dev-sw.js": { ssr: false },
    "/sw.js": { ssr: false },
    "/workbox-*.js": { ssr: false },
    '/api/nuxt/**': { 
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Origin': '*'
      }
    },
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
    pageTransition: { name: "page", mode: "out-in" },
    rootId: "__nuxt",
    buildAssetsDir: "/_nuxt/",
    baseURL: "/",
  },
  runtimeConfig: {
    cookies: {
      secure: process.env.NUXT_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
    },
    cryptoKey: process.env.NUXT_CRYPTO_KEY,
    public: {
      baseURL: process.env.NUXT_CLIENT_SIDE_URL || "http://localhost:8000",
      serverSideBaseURL:
        process.env.NUXT_SERVER_SIDE_URL || "http://django:8000",
      sentencesPath:
        process.env.NUXT_ENV === "production" ? ".output/server/data" : "server/data",
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
    },
  },
  experimental: {
    buildCache: true,
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
        "jp-transliterator",
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
    storage: {
      cache: {
        driver: "lruCache",
        max: 1000,
      },
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Saltype",
      short_name: "Saltype",
      theme_color: "#ffffff",
      display: "fullscreen",
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
      globPatterns: [
        "**/_nuxt/**/*.{js,css}",
        "**/*.{png,jpg,jpeg,svg,ico}",
        "manifest.webmanifest",
      ],
      navigateFallback: "/",
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
      ],
    },
    strategies: "generateSW",
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
    injectRegister: "auto",
    includeAssets: ["favicon.ico"],
    registerWebManifestInRouteRules: true,
  },
});
