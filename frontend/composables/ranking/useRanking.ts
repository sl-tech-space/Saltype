export function useRanking() {
  const config = useRuntimeConfig();

  const getRanking = async (language: Number, difficulty: Number) => {
    try {
      const response = await fetch(
        `${config.public.baseURL}/api/score/pastscores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lang_id: language,
            diff_id: difficulty,
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
    getRanking,
  };
}
