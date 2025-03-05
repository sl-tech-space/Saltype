import { ref, onMounted } from 'vue';

/**
 * LocalStorageを使用するためのカスタムフック（SSR対応版）
 * @param key - キー名
 * @param defaultValue - デフォルト値
 * @returns 
 * - value: 現在の値
 * - setValue: 値を設定する関数
 * - getValue: 値を取得する関数
 */
export const useLocalStorage = (key: string, defaultValue: any = null) => {
    // SSRの場合はデフォルト値を使用
    const value = ref(defaultValue);

    // クライアントサイドでのみ実行される処理
    if (process.client) {
        // 初期値の設定（localStorageから取得）
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            value.value = stored;
        } else if (defaultValue !== null) {
            localStorage.setItem(key, defaultValue);
            value.value = defaultValue;
        }

        // ストレージイベントの監視
        window.addEventListener('storage', (event) => {
            if (event.key === key) {
                value.value = event.newValue;
            }
        });
    }

    const setValue = (newValue: string) => {
        value.value = newValue;
        if (process.client) {
            localStorage.setItem(key, newValue);
            window.dispatchEvent(new StorageEvent('storage', {
                key: key,
                newValue: newValue,
            }));
        }
    };

    const getValue = () => {
        if (process.client) {
            return localStorage.getItem(key);
        }
        return value.value;
    };

    return {
        value,
        setValue,
        getValue
    };
}; 