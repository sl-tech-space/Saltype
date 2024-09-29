import { useSession } from "../server/useSession";

export function useScoreBoardParam() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();

  const getParam = async (
    selectedLanguage: number,
    selectedDifficulty: number,
    totalCorrectTypedCount: number,
    typingAccuracy: number
  ) => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/score/insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            lang_id: Number(selectedLanguage),
            diff_id: Number(selectedDifficulty),
            typing_count: Number(totalCorrectTypedCount),
            accuracy: Number(typingAccuracy)
          }),
        }
      );

      if (!response.ok) {
        throw new Error("スコアボードデータの取得に失敗しました");
      }
      
      const data = await response.json();

      return data;

    } catch (error) {
    }
  };

  return {
    getParam
  };
}