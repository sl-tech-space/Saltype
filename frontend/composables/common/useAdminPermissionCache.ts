import { useLocalStorage } from './useLocalStorage';

/**
 * 管理者権限のキャッシュを管理するためのカスタムフック
 * @param userId - ユーザーID
 * @returns 
 * - getCache: キャッシュされた権限を取得
 * - setCache: 権限をキャッシュに保存
 */
export const useAdminPermissionCache = (userId: string) => {
    const { value, setValue } = useLocalStorage(`admin_permission_${userId}`);

    const getCache = () => {
        if (!value.value) return null;
        return JSON.parse(value.value);
    };

    const setCache = (isAdmin: boolean) => {
        setValue(JSON.stringify(isAdmin));
    };

    return {
        getCache,
        setCache
    };
}; 