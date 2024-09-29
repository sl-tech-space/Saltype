import { useSession } from "../server/useSession";

export function useAnalyze() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();
  const typoFrequency = ref<TypoFrequency[]>([]);

  interface TypoFrequency {
    miss_char: string;
    miss_count: number;
  }

  const getTypoFrequencyByLimitParam = async (limit: Number) => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/mistypes/top`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            count: limit,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ミスタイプ頻度の取得に失敗");
      }

      const data = await response.json();

      typoFrequency.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  const getPastScores = async (
    selectedLanguage: Number,
    selectedDifficulty: Number
  ) => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/score/pastscores`,
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
        throw new Error("過去のスコア取得に失敗");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    typoFrequency,
    getTypoFrequencyByLimitParam,
    getPastScores
  };
}
