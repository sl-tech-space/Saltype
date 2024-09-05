// https://nuxt.com/docs/api/configuration/nuxt-config
import crypto from 'crypto';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  routeRules: {
    '/': { ssr: false } //ログイン画面 - CSR
  },
  app: {
    head: {
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true }
      ]
    }
  },
  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_APP_GOOGLE_CLIENT_ID,
      baseURL: 'http://localhost:8000', //Django REST Framework接続
      cryptKey: process.env.NUXT_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    },
  },
})
