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
    "/typing": { ssr: true }, // SSR
    "/score": { ssr: true }, // SSR
    "/analyze": { ssr: true }, // SSR
    "/ranking": { isr: 300 }, // ISR 5minutes
    "/contact": { ssr: false }, // CSR
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
    },
  },
  runtimeConfig: {
    session: {
      expiryInSeconds: 60 * 60 * 24,
      rolling: true,
      sameSite: "lax",
      httpOnly: true,
    },
    cryptoKey:
      process.env.NUXT_ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex"),
    public: {
      baseURL: "http://localhost", //Django REST Framework接続
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;',
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
        'defu'
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
});
