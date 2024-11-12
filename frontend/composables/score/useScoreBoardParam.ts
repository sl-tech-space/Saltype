import { useUser } from "../conf/useUser";
import type { ScoreBoardData } from "~/types/score";

/**
 * タイピング結果画面処理
 * @returns getParam
 */
export function useScoreBoardParam() {
  const config = useRuntimeConfig();
  const { user, waitForUser } = useUser();
  const scoreBoardData = ref<ScoreBoardData | null>();

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
    try {
      await waitForUser();

      if (!user.value) {
        console.error("ユーザ情報が存在しません");
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
      // error
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
        `${config.public.baseURL}/api/django/score/ranking/`,
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
        }
      );

      if (!response.ok) {
        throw new Error("ランキングの取得に失敗しました");
      }

      const data = await response.json();

      return data;
    } catch (e) {
      // error
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
        `${config.public.baseURL}/api/django/score/average/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value?.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("平均スコアの取得に失敗しました");
      }

      const data = await response.json();

      return data;
    } catch (e) {
      // error
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
        `${config.public.baseURL}/api/django/score/rank/`,
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
        }
      );

      if (!response.ok) {
        throw new Error("ランクの取得に失敗しました");
      }

      const data = await response.json();

      return data;
    } catch (e) {
      // error
    }
  };

  return {
    getParam,
  };
}
