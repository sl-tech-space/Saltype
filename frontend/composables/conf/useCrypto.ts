import { encryptData, decryptData } from "~/utils/cryptoUtils";

/**
 * クライアントサイドデータの暗号化、復号化
 * @returns encrypt, decrypt
 */
export function useCrypto() {
  const config = useRuntimeConfig();
  const key = config.cryptoKey as string;
  const cryptoKey = ref<CryptoKey | null>(null);

  function adjustKeyLength(key: string): Uint8Array {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    // キーを32バイト（256ビット）に調整
    if (keyData.length < 32) {
      return new Uint8Array(32).map((_, i) => keyData[i % keyData.length]);
    } else if (keyData.length > 32) {
      return keyData.slice(0, 32);
    }
    return keyData;
  }

  /**
   * 暗号キー初期化
   */
  async function initializeCryptoKey() {
    if (!cryptoKey.value) {
      const adjustedKeyData = adjustKeyLength(key);
      cryptoKey.value = await crypto.subtle.importKey(
        "raw",
        adjustedKeyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
    }
  }

  /**
   * 暗号化
   * @param data
   * @returns encryptData
   */
  async function encrypt(data: string): Promise<string> {
    await initializeCryptoKey();
    return await encryptData(data, cryptoKey.value!);
  }

  /**
   * 復号化
   * @param encryptedData
   * @returns decryptData
   */
  async function decrypt(encryptedData: string): Promise<string> {
    await initializeCryptoKey();
    return await decryptData(encryptedData, cryptoKey.value!);
  }

  return {
    encrypt,
    decrypt,
  };
}
