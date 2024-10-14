import { describe, it, expect, beforeAll } from "vitest";
import { encryptData, decryptData } from "#imports";

describe("暗号化と復号化のテスト", () => {
  let key: CryptoKey;

  beforeAll(async () => {
    // テスト用の鍵を生成
    key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  });

  it("データを暗号化して復号化できること", async () => {
    const originalData = "テストデータ";

    // 暗号化
    const encryptedData = await encryptData(originalData, key);

    // 暗号化されたデータが元のデータと異なることを確認
    expect(encryptedData).not.toBe(originalData);

    // 復号化
    const decryptedData = await decryptData(encryptedData, key);

    // 復号化されたデータが元のデータと一致することを確認
    expect(decryptedData).toBe(originalData);
  });

  it("異なるデータで暗号化すると異なる結果になること", async () => {
    const data1 = "データ1";
    const data2 = "データ2";

    const encrypted1 = await encryptData(data1, key);
    const encrypted2 = await encryptData(data2, key);

    expect(encrypted1).not.toBe(encrypted2);
  });

  it("不正なデータで復号化を試みるとエラーになること", async () => {
    const invalidData = "invalid_encrypted_data";

    await expect(decryptData(invalidData, key)).rejects.toThrow();
  });
});
