import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

interface GoogleUserInfo {
    email: string;
    name: string;
    picture: string;
}

export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  const user = ref<GoogleUserInfo | null>(null)
  const error = ref<Error | null>(null)

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const google = (window as any).google
      if (!google) throw new Error('Google Identity Services not loaded')

      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (response: any) => {
          if (response.access_token) {
            // トークンを使用してユーザー情報を取得
            const { data: userInfo, error: userInfoError } = await useFetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            })

            if (userInfoError.value) {
              throw new Error('Failed to fetch user info')
            }

            if (userInfo.value) {
              console.log('User Info:', userInfo.value)

              // ユーザー情報をDRFのAPIに送信
              const { data, error: apiError } = await useFetch(`${config.public.baseURL}/api/register/`, {
                method: 'POST',
                body: {
                  username: userInfo.value.email,
                  email: userInfo.value.email,
                  profile_picture: userInfo.value.picture
                }
              })

              if (apiError.value) {
                throw new Error('Failed to register user')
              }

              user.value = data.value as GoogleUserInfo
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