import { useRouter } from 'vue-router';
import { useToken } from './useToken';
import { useSession } from '../server/useSession';

/**
 * ログアウト処理
 * ローカルストレージのトークン、サーバセッションを削除
 * @returns logout
 */
export async function useLogout() {
  const router = useRouter();
  const { isTokenAvailable, removeToken } = useToken();
  const { removeSession } = useSession();

  const logout = async () => {
    try {
      if(isTokenAvailable()) {
        removeToken();
        removeSession()
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