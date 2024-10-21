import { useUser } from "../conf/useUser";

export function useScoreBoardParam() {
  const config = useRuntimeConfig();
  const { user } = useUser();

  const getParam = async (
    selectedLanguage: number,
    selectedDifficulty: number,
    totalCorrectTypedCount: number,
    typingAccuracy: number
  ) => {
    try {
      if (!user.value) {
        console.error("ユーザ情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/score/process/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
            typing_count: Number(totalCorrectTypedCount),
            accuracy: Number(typingAccuracy),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("スコアボードデータの取得に失敗しました");
      }

      const data = await response.json();

      const isRankUpdate: boolean = data.is_high_score;

      if (isRankUpdate) {
        _userRankUpdate(selectedLanguage, selectedDifficulty);
      }

      return data;
    } catch (e) {}
  };

  const _userRankUpdate = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ) => {
    try {
      if (!user.value) {
        console.error("ユーザ情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/score/process/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ユーザのランク更新に失敗しました");
      }
    } catch (e) {}
  };

  return {
    getParam,
  };
}
