import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGoogleAuth } from "../../../composables/auth/useGoogleAuth";

// モック関数を先に定義
const mockAuthToken = vi.fn();
let mockCookie: { value: string | null } = { value: null };

const mockConfig = {
  public: {
    baseURL: "http://test.com",
    googleClientId: "test-client-id",
  },
};

const mockUserInfo = {
  name: "Test User",
  email: "test@example.com",
};

const mockGoogleClient = {
  requestAccessToken: vi.fn(),
};

// モックを先に定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
  useCookie: () => mockCookie,
}));

vi.mock("../../../composables/auth/useAuthToken", () => ({
  useAuthToken: () => ({
    authToken: mockAuthToken,
  }),
}));

describe("useGoogleAuth", () => {
  let mockFetch: any;
  let mockGoogleAccounts: any;
  let googleAuth: ReturnType<typeof useGoogleAuth>;

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks();
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    mockCookie = { value: null };

    // Google APIのモック
    mockGoogleAccounts = {
      oauth2: {
        initTokenClient: vi.fn().mockReturnValue(mockGoogleClient),
      },
    };
    (window as any).google = { accounts: mockGoogleAccounts };

    googleAuth = useGoogleAuth();
  });

  it("Google APIが読み込まれていない場合、エラーが設定される", async () => {
    (window as any).google = undefined;

    await googleAuth.loginWithGoogle();

    expect(googleAuth.error.value).toBe("ログインに失敗しました。");
  });

  it("アクセストークンが存在しない場合、エラーが設定される", async () => {
    mockGoogleAccounts.oauth2.initTokenClient.mockImplementation(
      ({ callback }) => {
        callback({});
        return mockGoogleClient;
      }
    );

    await googleAuth.loginWithGoogle();

    expect(googleAuth.error.value).toBe("ユーザ情報が存在しません。");
  });
});
