import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUser } from "../../../composables/common/useUser";
import { useUserInfo } from "../../../composables/common/useUserInfo";
import { useAdminPermissionCache } from "../../../composables/common/useAdminPermissionCache";

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
    waitForUser: vi.fn(),
  }),
}));

vi.mock("../../../composables/common/useAdminPermissionCache", () => ({
  useAdminPermissionCache: () => ({
    getCache: vi.fn().mockReturnValue(null),
    setCache: vi.fn(),
  }),
}));

describe("useUser", () => {
  let mockFetch: any;
  let user: ReturnType<typeof useUser>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    user = useUser();
  });

  describe("updateUserInfo", () => {
    it("ユーザー情報の更新に失敗した場合、エラーメッセージを返す", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await user.updateUserInfo({
        userId: "test-id",
      });

      expect(result).toBe("保存に失敗しました。");
    });

    it("ネットワークエラーの場合、エラーメッセージを返す", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await user.updateUserInfo({
        userId: "test-id",
      });

      expect(result).toBe("保存に失敗しました。");
    });
  });

  describe("checkAdminPermission", () => {
    it("forceがtrueの場合、キャッシュを無視してAPIを呼び出す", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ isAdmin: true }),
      });

      await user.checkAdminPermission(true);

      expect(mockFetch).toHaveBeenCalled();
      expect(user.isAdmin.value).toBe(true);
    });

    it("APIエラーの場合、エラーメッセージを設定する", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await user.checkAdminPermission(true);

      expect(user.error.value).toBe("ミスタイプ頻度の取得に失敗しました");
    });

    it("ネットワークエラーの場合、エラーメッセージを設定する", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await user.checkAdminPermission(true);

      expect(user.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });
  });
});
