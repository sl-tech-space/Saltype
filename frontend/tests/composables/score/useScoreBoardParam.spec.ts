import { describe, it, expect, vi, beforeEach } from "vitest";
import { useScoreBoardParam } from "../../../composables/score/useScoreBoardParam";
import { useUserInfo } from "../../../composables/common/useUserInfo";
import type { UserData } from "../../../types/user.d";

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

const mockScore = {
  value: "100",
};

// モックの定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: { value: mockUser },
    waitForUser: vi.fn(),
    setUser: (userData: UserData) => {},
    clearUser: () => {},
  }),
}));

vi.mock("../../../composables/common/useLocalStorage", () => ({
  useLocalStorage: () => ({ value: mockScore }),
}));

describe("useScoreBoardParam", () => {
  let mockFetch: any;
  let scoreBoard: ReturnType<typeof useScoreBoardParam>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    scoreBoard = useScoreBoardParam();
  });

  describe("getParam", () => {
    const mockResponses = {
      ranking: {
        ranking_position: 1,
      },
      average: {
        average_score: 85,
      },
      userRank: {
        is_highest: true,
        rank_name: "S",
      },
    };

    beforeEach(() => {
      // 各APIのレスポンスをモック
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses.ranking),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses.average),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses.userRank),
        });
    });

    it("スコアボードデータを正しく取得できる", async () => {
      const result = await scoreBoard.getParam(1, 1);

      expect(result).toEqual({
        is_high_score: true,
        rank: "S",
        ranking_position: 1,
        score: 100,
        average_score: 85,
      });
      expect(scoreBoard.isLoading.value).toBe(false);
    });

    it("ランキング取得APIがエラーの場合、エラーメッセージを設定", async () => {
      mockFetch.mockReset().mockResolvedValue({
        ok: false,
      });

      await scoreBoard.getParam(1, 1);

      expect(scoreBoard.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });

    it("ネットワークエラーの場合、エラーメッセージを設定", async () => {
      mockFetch.mockReset().mockRejectedValue(new Error("Network error"));

      await scoreBoard.getParam(1, 1);

      expect(scoreBoard.error.value).toBe(
        "ネットワークエラーが発生しました。接続を確認してください。"
      );
    });
  });
});
