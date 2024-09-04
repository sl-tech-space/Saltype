enum GoogleTokenType {
    AccessToken = "access",
    RefreshToken = "refresh"
}

// トークンを保存する
export function saveGoogleToken(token: string, type: GoogleTokenType): void {
    switch(type) {
        case GoogleTokenType.AccessToken:
            localStorage.setItem('googleAcessToken', token);
            break;
        case GoogleTokenType.RefreshToken:
            localStorage.setItem('googleRefreshToken', token);
            break;
    } 
}

// トークンを取得する
export function getGoogleToken(type: GoogleTokenType): string | null {
    switch(type) {
        case GoogleTokenType.AccessToken:
            return localStorage.getItem('googleAcessToken');
        case GoogleTokenType.RefreshToken:
            return localStorage.getItem('googleRefreshToken');
    } 
}

// トークンを削除する
export function removeGoogleToken(type: GoogleTokenType): void {
    switch(type) {
        case GoogleTokenType.AccessToken:
            localStorage.removeItem('googleAcessToken');
            break;
        case GoogleTokenType.RefreshToken:
            localStorage.removeItem('googleRefreshToken');
            break;
    } 
}

// トークンの存在を確認する
export function isGoogleTokenAvailable(type: GoogleTokenType): boolean {
    switch(type) {
        case GoogleTokenType.AccessToken:
            return getGoogleToken(GoogleTokenType.AccessToken) !== null;
        case GoogleTokenType.RefreshToken:
            return getGoogleToken(GoogleTokenType.RefreshToken) !== null;
    } 
}