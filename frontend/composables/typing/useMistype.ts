import { ref, computed } from "vue";
import { useSession } from "../server/useSession";

/**
 * ミスタイプキー処理
 * @returns     mistypeCount,　totalMistypes,　countMistype,
 * resetMistypeStats, sendMistypeDataToServer,
 */
export function useMistype() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();
  const mistypeCount = ref<Record<string, number>>({});

  /**
   * ミスタイプ合計計算処理
   */
  const totalMistypes = computed(() => {
    return Object.values(mistypeCount.value).reduce(
      (sum, count) => sum + count,
      0
    );
  });

  /**
   * 各キーのミスタイプ数を計算
   * @param key
   */
  const countMistype = (key: string) => {
    mistypeCount.value = {
      ...mistypeCount.value,
      [key]: (mistypeCount.value[key] || 0) + 1,
    };
  };

  /**
   * ミスタイプカウントを初期化
   */
  const resetMistypeStats = () => {
    mistypeCount.value = {};
  };

  /**
   * 各キーのミスタイプ数をリクエストを送るjson形式に変換
   * @returns json
   */
  const formatMistypeData = () => {
    return Object.entries(mistypeCount.value).map(
      ([miss_char, miss_count]) => ({
        miss_char,
        miss_count,
      })
    );
  };

  /**
   * ミスタイプ数送信
   */
  const sendMistypeDataToServer = async () => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        return;
      }

      const missData = formatMistypeData();

      const dataToSend = {
        user_id: user.user_id,
        miss_data: missData,
      };

      const response = await fetch(
        `${config.public.baseURL}/api/mistypes/insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error("ミスタイプデータの取得に失敗");
      }

      resetMistypeStats();
    } catch (error) {
      console.error("Error sending mistype data:", error);
    }
  };

  return {
    mistypeCount,
    totalMistypes,
    countMistype,
    resetMistypeStats,
    sendMistypeDataToServer,
  };
}
