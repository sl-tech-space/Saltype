import { useCrypto } from "../conf/useCrypto";

/**
 * ローカルストレージのトークン処理
 * @returns saveToken, getToken, removeToken, isTokenAvailable
 */
export function useToken() {
    const { encrypt, decrypt } = useCrypto()

    async function saveToken(token: string): Promise<void> {
        try {
            const encryptedToken = await encrypt(token);
            localStorage.setItem('accessToken', encryptedToken);
        } catch(error) {
            console.log("トークンの保存に失敗")
        }
    }

    async function getToken(): Promise<string | null> {
        try {
            const encryptedToken = localStorage.getItem('accessToken');
            if(!encryptedToken) return null;
            return await decrypt(encryptedToken);
        } catch(error) {
            console.log("トークンの取得に失敗")
            return null;
        }
    }

    function removeToken(): void {
        localStorage.removeItem('accessToken');
    }

    function isTokenAvailable(): boolean {
        return localStorage.getItem('accessToken') !== null
    }

    return {
        saveToken,
        getToken,
        removeToken,
        isTokenAvailable
    }
}