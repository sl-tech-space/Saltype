import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePasswordReset } from "../../../composables/settings/usePasswordReset";

// モックの設定
const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

// モックの定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

describe("usePasswordReset", () => {
  let mockFetch: any;
  let passwordReset: ReturnType<typeof usePasswordReset>;

  beforeEach(() => {
    // @ts-ignore
    mockFetch = vi.spyOn(global, "$fetch").mockReset();
    passwordReset = usePasswordReset();
  });

  describe("requestResetPassword", () => {
    const testEmail = "test@example.com";

    it("エラー時でも成功メッセージを表示する", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      await passwordReset.requestResetPassword(testEmail);

      expect(passwordReset.successNotification.value).toEqual({
        message: "成功",
        content: `パスワード再設定のリンクをお送りしました。<br>メールを確認してください。<br>${testEmail}`,
      });
    });
  });

  describe("resetPassword", () => {
    const testToken = "test-token";
    const testPassword = "new-password";

    it("エラー時にエラーメッセージを表示する", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      await passwordReset.resetPassword(testToken, testPassword);

      expect(passwordReset.errorNotification.value).toEqual({
        message: "失敗",
        content: "パスワード再設定に失敗しました。",
      });
    });
  });

  describe("tokenIsValid", () => {
    const testToken = "test-token";

    it("無効なトークンの場合falseを返す", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await passwordReset.tokenIsValid(testToken);

      expect(result).toBe(false);
    });

    it("トークンが空の場合falseを返す", async () => {
      const result = await passwordReset.tokenIsValid("");

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("ローディング状態の管理", () => {
    it("各操作の開始時にローディング状態がtrueになる", async () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // 解決されないPromise

      passwordReset.requestResetPassword("test@example.com");
      expect(passwordReset.isLoading.value).toBe(true);

      passwordReset.resetPassword("token", "password");
      expect(passwordReset.isLoading.value).toBe(true);

      passwordReset.tokenIsValid("token");
      expect(passwordReset.isLoading.value).toBe(true);
    });
  });
});
