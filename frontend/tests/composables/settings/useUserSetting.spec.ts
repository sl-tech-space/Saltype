import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserSetting } from "../../../composables/settings/useUserSetting";
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

const mockUserData = {
  data: {
    user_id: "test-user-id",
    username: "test-user",
    email: "test@example.com",
  },
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

describe("useUserSetting", () => {
  let mockFetch: any;
  let userSetting: ReturnType<typeof useUserSetting>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    userSetting = useUserSetting();
  });

  describe("getUserInfo", () => {
    it("APIエラーの場合、エラーメッセージを設定", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      });

      await userSetting.getUserInfo();

      expect(userSetting.error.value).toBe("ユーザ情報の取得に失敗しました");
    });

    it("ネットワークエラーの場合、エラーメッセージを設定", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await userSetting.getUserInfo();

      expect(userSetting.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });

    it("タイムアウトが設定される", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      });

      await userSetting.getUserInfo();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it("ローディング状態が適切に管理される", async () => {
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const promise = userSetting.getUserInfo();
      expect(userSetting.isLoading.value).toBe(true);

      await promise;
      expect(userSetting.isLoading.value).toBe(false);
    });
  });
});
