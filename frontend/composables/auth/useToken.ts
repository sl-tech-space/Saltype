// トークンを保存する
export function saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
}

// トークンを取得する
export function getToken(): string | null {
    return localStorage.getItem('accessToken');
}

// トークンを削除する
export function removeToken(): void {
    localStorage.removeItem('accessToken');
}

// トークンの存在を確認する
export function isTokenAvailable(): boolean {
    return getToken() !== null;
}