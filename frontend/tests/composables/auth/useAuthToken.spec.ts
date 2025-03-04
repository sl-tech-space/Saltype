import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthToken } from "../../../composables/auth/useAuthToken";

// モック関数を先に定義
const mockNavigateTo = vi.fn();
const mockSetUser = vi.fn();
const mockClearUser = vi.fn();
let mockCookie: { value: string | null } = { value: "test-token" };

const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

const mockUserData = {
  user_id: "test-user-id",
  username: "test-user",
};

// モックを先に定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
  navigateTo: (options: any) => mockNavigateTo(options),
  useCookie: () => mockCookie,
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    setUser: mockSetUser,
    clearUser: mockClearUser,
  }),
}));

describe("useAuthToken", () => {
  let mockFetch: any;
  let authToken: ReturnType<typeof useAuthToken>;

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks();
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    mockCookie = { value: "test-token" };
    authToken = useAuthToken();
  });

  it("トークンが存在しない場合、ユーザー情報をクリアする", async () => {
    mockCookie.value = null;

    await authToken.authToken();

    expect(mockClearUser).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
