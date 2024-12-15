import { useUserInfo } from "../conf/useUserInfo";
import type { ScoreBoardData } from "~/types/score";

/**
 * タイピング結果画面処理
 * @returns getParam, isLoading, error
 */
export function useScoreBoardParam() {
  const config = useRuntimeConfig();
  const { user, waitForUser } = useUserInfo();
  const scoreBoardData = ref<ScoreBoardData | null>();
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  /**
   * 全データを集約、各関数の呼び出し
   * @param selectedLanguage
   * @param selectedDifficulty
   * @returns Promise
   */
  const getParam = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ): Promise<ScoreBoardData | null | undefined> => {
    isLoading.value = true;

    try {
      await waitForUser();

      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const rankingData = await _getRanking(
        selectedLanguage,
        selectedDifficulty
      );

      const averageData = await _getAverageScore(
        selectedLanguage,
        selectedDifficulty
      );

      const userRankData = await _getUserRank(
        selectedLanguage,
        selectedDifficulty
      );

      scoreBoardData.value = {
        is_high_score: userRankData.is_highest,
        rank: userRankData.rank_name,
        ranking_position: rankingData.ranking_position,
        score: Number(localStorage.getItem("score")),
        average_score: averageData.average_score,
      };

      return scoreBoardData.value;
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ランキングを取得
   * @param selectedLanguage
   * @param selectedDifficulty
   * @returns Promise
   */
  const _getRanking = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ) => {
    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/score/userranking/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value?.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
            score: Number(localStorage.getItem("score")),
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "ランキングの取得に失敗しました";
        return;
      }

      const data = await response.json();

      return data;
    } catch (e) {
      error.value = "ランキングの取得に失敗しました";
    }
  };

  /**
   * 平均スコアを取得
   * @param selectedLanguage
   * @param selectedDifficulty
   * @returns Promise
   */
  const _getAverageScore = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ) => {
    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/score/select/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value?.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
            action: "get_average_score",
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "平均スコアの取得に失敗しました";
        return;
      }

      const data = await response.json();

      return data;
    } catch (e) {
      error.value = "平均スコアの取得に失敗しました";
    }
  };

  /**
   * ユーザのランクを取得
   * @param selectedLanguage
   * @param selectedDifficulty
   * @returns Promise
   */
  const _getUserRank = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ) => {
    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/score/userrank/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value?.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
            score: Number(localStorage.getItem("score")),
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "ランクの取得に失敗しました";
        return;
      }

      const data = await response.json();

      return data;
    } catch (e) {
      error.value = "ランクの取得に失敗しました";
    }
  };

  return {
    getParam,
    isLoading,
    error
  };
}
