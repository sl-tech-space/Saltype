import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRanking } from "../../../composables/ranking/useRanking";
import { useLanguageAndDifficulty } from "../../../composables/typing/useLanguageAndDifficulty";

// モックの設定
const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

const mockRankingData = {
  data: [
    { rank: 1, user_id: "1", username: "user1", score: 100 },
    { rank: 2, user_id: "2", username: "user2", score: 90 },
  ],
};

// モックの定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

vi.mock("../../../composables/typing/useLanguageAndDifficulty", () => ({
  useLanguageAndDifficulty: () => ({
    generateAllCombinations: () => [
      { languageId: 1, difficultyId: 1 },
      { languageId: 1, difficultyId: 2 },
      { languageId: 2, difficultyId: 1 },
      { languageId: 2, difficultyId: 2 },
    ],
  }),
}));

describe("useRanking", () => {
  let mockFetch: any;
  let ranking: ReturnType<typeof useRanking>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    ranking = useRanking();
  });

  describe("getRankingByLimitParam", () => {
    it("全言語・難易度のランキングデータを取得できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRankingData),
      });

      await ranking.getRankingByLimitParam(10);

      expect(mockFetch).toHaveBeenCalledTimes(4); // 2言語 × 2難易度
      expect(ranking.japaneseRankings.value).toHaveProperty("1-1");
      expect(ranking.japaneseRankings.value).toHaveProperty("1-2");
      expect(ranking.englishRankings.value).toHaveProperty("2-1");
      expect(ranking.englishRankings.value).toHaveProperty("2-2");
      expect(ranking.isLoading.value).toBe(false);
    });
  });

  describe("getDailyRankingByLimitParam", () => {
    it("デイリーランキングデータを取得できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRankingData),
      });

      await ranking.getDailyRankingByLimitParam(10);

      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(ranking.dailyJapaneseRankings.value).toHaveProperty("1-1");
      expect(ranking.dailyJapaneseRankings.value).toHaveProperty("1-2");
      expect(ranking.dailyEnglishRankings.value).toHaveProperty("2-1");
      expect(ranking.dailyEnglishRankings.value).toHaveProperty("2-2");
    });

    it("日付パラメータが正しく設定される", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRankingData),
      });

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      await ranking.getDailyRankingByLimitParam(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(formattedDate),
        })
      );
    });
  });

  describe("getRankingDetailsByIdAndLimitParam", () => {
    it("指定したIDのランキング詳細を取得できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRankingData),
      });

      await ranking.getRankingDetailsByIdAndLimitParam("1-1", 10);

      expect(ranking.rankingDetails.value).toEqual(mockRankingData.data);
      expect(ranking.detailsTitle.value).toBeDefined();
    });

    it("タイトルが正しく設定される", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRankingData),
      });

      await ranking.getRankingDetailsByIdAndLimitParam("1-1", 10);

      expect(ranking.detailsTitle.value).toContain("日本語");
      expect(ranking.detailsTitle.value).toContain("イージー");
    });
  });
});
