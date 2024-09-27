import type { RankingItem } from "./useRankingTypes";
import { useLanguageAndDifficulty } from "~/composables/typing/useLanguageAndDifficulty";

export function useRanking() {
  const config = useRuntimeConfig();
  const { generateAllCombinations } = useLanguageAndDifficulty();

  const isLoading = ref(true);
  const rankingsByCombination = ref<Record<string, RankingItem[]>>({});
  const japaneseRankings = ref<Record<string, RankingItem[]>>({});
  const englishRankings = ref<Record<string, RankingItem[]>>({});

  const getRankingByLimitParam = async (limit: Number) => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせでランキングデータを取得
    for (const { languageId, difficultyId } of allCombinations) {
      const key = `${languageId}-${difficultyId}`;
      const rankings = await _getRanking(languageId, difficultyId, limit);
      rankingsByCombination.value[key] = rankings;

      switch (key.charAt(0)) {
        case "1":
          japaneseRankings.value[key] = rankingsByCombination.value[key];
          break;
        case "2":
          englishRankings.value[key] = rankingsByCombination.value[key];
          break;
        default:
      }
    }

    isLoading.value = false;
  };

  const _getRanking = async (language: Number, difficulty: Number, limit: Number) => {
    try {
      const response = await fetch(`${config.public.baseURL}/api/ranking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang_id: language,
          diff_id: difficulty,
          ranking_limit: limit,
        }),
      });

      if (!response.ok) {
        throw new Error("ランキングデータ取得に失敗");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isLoading,
    japaneseRankings,
    englishRankings,
    getRankingByLimitParam,
  };
}
