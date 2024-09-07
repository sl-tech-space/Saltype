import { useCrypto } from "../conf/useCrypto";

export function useToken() {
    const { encrypt, decrypt } = useCrypto()

    async function saveToken(token: string): Promise<void> {
        try {
            console.log(token)
            const encryptedToken = await encrypt(token);
            console.log(encryptedToken)
            localStorage.setItem('accessToken', encryptedToken);
        } catch(error) {
            console.error("トークンの保存に失敗", error)
        }
    }

    async function getToken(): Promise<string | null> {
        try {
            const encryptedToken = localStorage.getItem('accessToken');
            if(!encryptedToken) return null;
            const decryptedToken = await decrypt(encryptedToken);
            console.log(decryptedToken)
            return await decrypt(encryptedToken);
        } catch(error) {
            console.log("トークンの取得に失敗", error)
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