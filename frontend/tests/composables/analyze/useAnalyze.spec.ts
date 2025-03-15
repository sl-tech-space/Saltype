import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalyze } from "../../../composables/analyze/useAnalyze";

// mockUserをvi.mockの前に定義し、constではなくlet使用
let mockUser = {
  user_id: "test-user-id",
  username: "test-user",
};

const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

// モックを先に定義
vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: { value: mockUser },
    waitForUser: vi.fn(),
  }),
}));

vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

describe("useAnalyze", () => {
  let mockFetch: any;
  let analyze: ReturnType<typeof useAnalyze>;

  beforeEach(() => {
    // モックのリセット
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    mockUser = {
      user_id: "test-user-id",
      username: "test-user",
    };
    analyze = useAnalyze();
  });

  describe("getTypoFrequencyByLimit", () => {
    it("APIエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await analyze.getTypoFrequencyByLimit(10);

      expect(analyze.error.value).toBe("ミスタイプ頻度の取得に失敗しました");
      expect(analyze.typoFrequency.value).toEqual([]);
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await analyze.getTypoFrequencyByLimit(10);

      expect(analyze.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });
  });

  describe("getPastScores", () => {
    it("APIエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const scores = await analyze.getPastScores(1, 1);

      expect(analyze.error.value).toBe("過去のスコア取得に失敗しました");
      expect(scores).toBeUndefined();
    });

    it("ネットワークエラー時にエラーメッセージが設定される", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const scores = await analyze.getPastScores(1, 1);

      expect(analyze.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
      expect(scores).toBeUndefined();
    });
  });
});
