// データを暗号化
async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encodedData
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const resultArray = new Uint8Array(iv.length + encryptedArray.length);
  resultArray.set(iv);
  resultArray.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode.apply(null, Array.from(resultArray)));
}

// データを復号
async function decryptData(
  encryptedData: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  const dataArray = new Uint8Array(
    atob(encryptedData)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const iv = dataArray.slice(0, 12);
  const data = dataArray.slice(12);

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return decoder.decode(decryptedData);
}

export { encryptData, decryptData };
