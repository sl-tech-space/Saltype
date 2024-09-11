import { ref } from 'vue'

interface User {
  user_id: string;
  email: string;
  username: string;
}

export function useSession() {
  const user: Ref<User | null> = ref(null)
  const error = ref(null)

  const getSession = async () => {
    try {
      const response = await fetch('/api/session/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch session')
      }
      const data = await response.json()
      if (data.user) {
        user.value = data.user
      } else {
        user.value = null
      }
    } catch (err) {
      console.error('Error fetching session')
    }
  }

  return {
    user,
    error,
    getSession
  }
}