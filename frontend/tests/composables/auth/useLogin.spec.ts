import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLogin } from "../../../composables/auth/useLogin";

// モック関数を先に定義
const mockAuthToken = vi.fn();
const mockNavigateTo = vi.fn();
let mockCookie: { value: string | null } = { value: null };
let mockUser: { value: { user_id: string } | null } = { value: { user_id: "test-user" } };

const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

// モックを先に定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
  navigateTo: (options: any) => mockNavigateTo(options),
  useCookie: () => mockCookie,
}));

vi.mock("../../../composables/auth/useAuthToken", () => ({
  useAuthToken: () => ({
    authToken: mockAuthToken,
  }),
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: mockUser,
  }),
}));

describe("useLogin", () => {
  let mockFetch: any;
  let login: ReturnType<typeof useLogin>;

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks();
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    mockCookie = { value: null };
    mockUser = { value: { user_id: "test-user" } };
    login = useLogin();
  });

  describe("login", () => {
    it("APIエラー時にエラーメッセージが設定される", async () => {
      const errorMessage = "Invalid credentials";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            details: {
              detail: [errorMessage],
            },
          }),
      });

      await login.login("test@example.com", "wrong-password");

      expect(login.error.value).toBe(errorMessage);
      expect(mockAuthToken).not.toHaveBeenCalled();
    });

    it("トークンが存在しない場合、エラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await login.login("test@example.com", "password");

      expect(login.error.value).toBe("トークンが発行されませんでした。");
      expect(mockAuthToken).not.toHaveBeenCalled();
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await login.login("test@example.com", "password");

      expect(login.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });
  });

  describe("checkAdminPermission", () => {
    it("管理者権限チェックが成功した場合、isAdminがtrueになる", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await login.checkAdminPermission();

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/nuxt/check-admin-permission",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "test-user",
          }),
        })
      );
      expect(login.isAdmin.value).toBe(true);
      expect(login.error.value).toBeNull();
    });

    it("ユーザー情報が存在しない場合、エラーメッセージが設定される", async () => {
      mockUser.value = null;

      await login.checkAdminPermission();

      expect(login.error.value).toBe("ユーザ情報が存在しません。");
      expect(login.isAdmin.value).toBe(false);
    });

    it("権限チェックが失敗した場合、エラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await login.checkAdminPermission();

      expect(login.error.value).toBe("権限チェックエラーが発生しました。");
      expect(login.isAdmin.value).toBe(false);
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await login.checkAdminPermission();

      expect(login.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
      expect(login.isAdmin.value).toBe(false);
    });
  });
});
