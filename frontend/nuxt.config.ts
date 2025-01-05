// https://nuxt.com/docs/api/configuration/nuxt-config
import crypto from "crypto";

export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2024-09-20",
  devtools: { enabled: false },
  modules: ["@sidebase/nuxt-session"],
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
          content: "日本語と英語でタイピングスキルを向上させよう!!",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        // { name: "twitter:image", content: "https://ドメイン/assets/images/common/saltype-icon.png" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  runtimeConfig: {
    session: {
      expiryInSeconds: 60 * 60 * 24,
      rolling: true,
      sameSite: "lax",
      httpOnly: true,
    },
    cryptoKey: crypto.randomBytes(32).toString("hex"),
    public: {
      baseURL: "http://localhost:8000", //Django REST Framework接続
      serverSideBaseURL: "http://django:8000", //NuxtサーバサイドからDjango REST Framework接続
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
    },
  },
  vite: {
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
        "defu",
      ],
    },
    test: {
      environment: "nuxt",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: ["node_modules", ".nuxt", "coverage"],
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  cookies: {
    secure: process.env.NUXT_ENV === 'production',
    sameSite: "lax",
    httpOnly: true,
  },
});
