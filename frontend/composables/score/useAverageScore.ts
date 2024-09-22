import { useSession } from "../server/useSession";

export function useAverageScore() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();

  const getAverageScore = async (
    selectedLanguage: number,
    selectedDifficulty: number
  ) => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        return;
      }

      console.log(selectedLanguage, selectedDifficulty);

      const response = await fetch(
        `${config.public.baseURL}/api/score/average`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            lang_id: selectedLanguage,
            diff_id: selectedDifficulty
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("エラーレスポンス:", errorText);
        throw new Error("平均スコアの取得に失敗");
      }

      const data = await response.json();
      console.log(data);

      return data.average_score;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAverageScore,
  };
}
