import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAdmin } from "../../../composables/admin/useAdmin";

describe("useAdmin", () => {
  const mockConfig = {
    public: {
      baseURL: "http://test.com",
    },
  };

  vi.mock("#app", () => ({
    useRuntimeConfig: () => mockConfig,
  }));

  let mockFetch: any;
  let admin: ReturnType<typeof useAdmin>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch");
    admin = useAdmin();
  });

  describe("getAllUserInfo", () => {
    it("APIエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await admin.getAllUserInfo();

      expect(admin.error.value).toBe("全ユーザデータの取得に失敗しました");
      expect(admin.userItems.value).toEqual([]);
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await admin.getAllUserInfo();

      expect(admin.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
      expect(admin.userItems.value).toEqual([]);
    });

    it("ローディング状態が適切に更新される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      expect(admin.isLoading.value).toBe(false);

      const promise = admin.getAllUserInfo();
      expect(admin.isLoading.value).toBe(true);

      await promise;
      expect(admin.isLoading.value).toBe(false);
    });
  });

  describe("deleteUserInfo", () => {
    it("APIエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await admin.deleteUserInfo("test-user-id");

      expect(admin.error.value).toBe("ユーザの削除に失敗しました");
      expect(admin.message.value).toBe("");
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await admin.deleteUserInfo("test-user-id");

      expect(admin.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
      expect(admin.message.value).toBe("");
    });
  });
});
