// https://nuxt.com/docs/api/configuration/nuxt-config
import crypto from 'crypto';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-session'],
  routeRules: {
    '/': { isr: true },
    '/login': { ssr: false }, //ログイン画面 - CSR
    '/home': { ssr: true }
  },
  app: {
    head: {
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true }
      ]
    }
  },
  runtimeConfig: {
    cryptoKey: process.env.NUXT_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    public: {
      baseURL: 'http://localhost:8000', //Django REST Framework接続
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
    },
  },
  session: {
    expiryInSeconds: 60 * 60 * 24,
  },
})
