import { useSession } from "../server/useSession";

export function useTypoFrequency() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();
  const typoFrequencyTop3 = ref<TypoFrequency[]>([])

  interface TypoFrequency {
    miss_char: string;
    miss_count: number;
  }

  const getTypoFrequencyTop3 = async () => {
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ミスタイプ頻度の取得に失敗");
      }

      const data = await response.json();
      console.log(data);

      typoFrequencyTop3.value = data;

    } catch (error) {
      console.error("Error sending mistype data:", error);
    }
  };

  return {
    typoFrequencyTop3,
    getTypoFrequencyTop3,
  };
}
