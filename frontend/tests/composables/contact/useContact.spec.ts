import { describe, it, expect, vi, beforeEach } from "vitest";
import { useContact } from "../../../composables/contact/useContact";
import { useUserInfo } from "../../../composables/common/useUserInfo";

// モックの設定
const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

const mockUser = {
  user_id: "test-user-id",
  username: "test-user",
};

// モックの定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: { value: mockUser },
  }),
}));

describe("useContact", () => {
  let mockFetch: any;
  let contact: ReturnType<typeof useContact>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    contact = useContact();
  });

  describe("sendContentToServer", () => {
    it("ネットワークエラーの場合、エラーメッセージを返す", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await contact.sendContentToServer("テスト要望");

      expect(result).toBe("送信失敗");
    });

    it("ローディング状態が適切に更新される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      expect(contact.isLoading.value).toBe(false);

      const promise = contact.sendContentToServer("テスト要望");
      expect(contact.isLoading.value).toBe(true);

      await promise;
      expect(contact.isLoading.value).toBe(false);
    });

    it("空白を含む要望内容が正しくトリムされる", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await contact.sendContentToServer("  テスト要望  ");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            user_id: mockUser.user_id,
            request_content: "テスト要望",
          }),
        })
      );
    });
  });
});
