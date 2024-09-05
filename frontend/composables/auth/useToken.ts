import { useCrypto } from "../conf/useCrypto";

// トークンを保存する
export async function saveToken(token: string): Promise<void> {
    const { encrypt } = useCrypto();
    try {
        console.log(token)
        const encryptedToken = await encrypt(token);
        console.log(encryptedToken)
        localStorage.setItem('accessToken', encryptedToken);
    } catch(error) {
        console.error("トークンの保存に失敗", error)
    }
}

// トークンを取得する
export async function getToken(): Promise<string | null> {
    const { decrypt } = useCrypto()
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

// トークンを削除する
export function removeToken(): void {
    localStorage.removeItem('accessToken');
}

// トークンの存在を確認する
export function isTokenAvailable(): boolean {
    return localStorage.getItem('accessToken') !== null
}