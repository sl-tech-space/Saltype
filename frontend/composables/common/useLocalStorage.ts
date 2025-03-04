/**
 * LocalStorageを使用するためのカスタムフック
 * @param key - キー名
 * @param defaultValue - デフォルト値
 * @returns 
 * - value: 現在の値
 * - setValue: 値を設定する関数
 * - getValue: 値を取得する関数
 */
export const useLocalStorage = (key: string, defaultValue: any = null) => {
    const value = ref(localStorage.getItem(key));

    const setValue = (newValue: string) => {
        value.value = newValue;
        localStorage.setItem(key, newValue);
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: newValue,
        }));
    };

    const getValue = () => {
        return localStorage.getItem(key);
    };

    // ストレージイベントの監視
    window.addEventListener('storage', (event) => {
        if (event.key === key) {
            value.value = event.newValue;
        }
    });

    // 初期値の設定
    if (value.value === null && defaultValue !== null) {
        setValue(defaultValue);
    }

    return {
        value,
        setValue,
        getValue
    };
}; 