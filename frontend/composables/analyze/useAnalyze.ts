import { useUserInfo } from "../common/useUserInfo";
import type { TypoFrequency } from "~/types/analyze";

/**
 * 分析情報画面処理
 * @returns typoFrequency, getTypoFrequencyByLimit, getPastScores,
 */
export function useAnalyze() {
  const config = useRuntimeConfig();
  const { user, waitForUser } = useUserInfo();
  const typoFrequency = ref<TypoFrequency[]>([]);
  const scoresByCombination = ref<Record<string, { scores: number[] }>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * ミスタイプTOP{limit}の取得
   * @param limit
   */
  const getTypoFrequencyByLimit = async (limit: number): Promise<void> => {
    isLoading.value = true;

    try {
      await waitForUser();

      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/mistype/topmistypes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            limit: limit,
            action: "get_top_mistypes",
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "ミスタイプ頻度の取得に失敗しました";
        return;
      }

      const data = await response.json();

      typoFrequency.value = data.top_mistypes;
    } catch {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    }
  };

  /**
   * 過去データの取得
   * @param selectedLanguage
   * @param selectedDifficulty
   * @returns data.scores
   */
  const getPastScores = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ): Promise<number[] | undefined> => {
    isLoading.value = true;

    try {
      await waitForUser();

      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/score/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: selectedLanguage,
            diff_id: selectedDifficulty,
            action: "get_past_scores",
          }),
        }
      );

      if (!response.ok) {
        error.value = "過去のスコア取得に失敗しました";
        return;
      }

      const data = await response.json();

      return data.scores;
    } catch {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    }
  };

  return {
    typoFrequency,
    scoresByCombination,
    isLoading,
    error,
    getTypoFrequencyByLimit,
    getPastScores,
  };
}
