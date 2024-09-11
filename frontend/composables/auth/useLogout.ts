import { useRouter } from 'vue-router';
import { useToken } from './useToken';

export async function useLogout() {
  const router = useRouter();
  const { isTokenAvailable, removeToken } = useToken();

  const logout = async () => {
    try {
      if(isTokenAvailable()) {
        removeToken();

        const response = await fetch('/api/session/get', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if(response.ok) {
          console.log('またね！')
        }
      }

      await router.push('/login');
    } catch (error) {
      alert("ログアウトに失敗：管理者に連絡してください")
    }
  };

  return {
    logout
  };
}