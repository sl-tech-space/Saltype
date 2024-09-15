import { ref } from 'vue'
import { useRouter } from "vue-router";
import { useRuntimeConfig } from 'nuxt/app'

interface GoogleUserInfo {
  email: string;
  name: string;
}

/**
 * Google認証処理
 * @returns user, error, loginWithGoogle
 */
export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  const user = ref<GoogleUserInfo | null>(null)
  const error = ref<Error | null>(null)
  const router = useRouter();

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const google = (window as any).google
      if (!google) throw new Error('Google Identity Services not loaded')

      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (response: any) => {
          if (response.access_token) {
            const { data: userInfo, error: userInfoError } = await useFetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            })

            if (userInfoError.value) {
              throw new Error('Failed to fetch user info')
            }

            if (userInfo.value) {
              console.log('User Info:', userInfo.value)

              const { data, error: apiError } = await useFetch(`${config.public.baseURL}/api/google-auth/`, {
                method: 'POST',
                body: {
                  username: userInfo.value.name,
                  email: userInfo.value.email,
                }
              })

              if (apiError.value) {
                throw new Error('Failed to register user')
              }

              user.value = data.value as GoogleUserInfo

              router.push({ name: "home" });
            } else {
              throw new Error('User info is null')
            }
          }
        },
      })

      client.requestAccessToken()
    } catch (err) {
      console.error('Google login error:', err)
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    }
  }

  return {
    user,
    error,
    loginWithGoogle
  }
}