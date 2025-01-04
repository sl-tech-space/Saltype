import { ref, computed } from "vue";
import { useUserInfo } from "../common/useUserInfo";

/**
 * ミスタイプキー処理
 * @returns mistypeCount,　totalMistypes,　countMistype,
 * resetMistypeStats, sendMistypeDataToServer,
 */
export function useMistype() {
  const config = useRuntimeConfig();
  const { user } = useUserInfo();
  const mistypeCount = ref<Record<string, number>>({});

  /**
   * ミスタイプ合計計算処理
   */
  const totalMistypes = computed((): number => {
    return Object.values(mistypeCount.value).reduce(
      (sum, count) => sum + count,
      0
    );
  });

  /**
   * 各キーのミスタイプ数を計算
   * @param key
   */
  const countMistype = (key: string): void => {
    const alphabetRegex = /^[a-zA-Z]$/;

    if (alphabetRegex.test(key)) {
      mistypeCount.value = {
        ...mistypeCount.value,
        [key.toLowerCase()]: (mistypeCount.value[key.toLowerCase()] || 0) + 1,
      };
    }
  };

  /**
   * ミスタイプカウントを初期化
   */
  const resetMistypeStats = (): void => {
    mistypeCount.value = {};
  };

  /**
   * 各キーのミスタイプ数をリクエストを送るjson形式に変換
   * @returns json
   */
  const _formatMistypeData = (): {
    miss_char: string;
    miss_count: number;
  }[] => {
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
  const sendMistypeDataToServer = async (): Promise<void> => {
    try {
      if (!user.value) {
        throw new Error();
      }

      const mistypes = _formatMistypeData();

      const dataToSend = {
        user_id: user.value.user_id,
        mistypes: mistypes,
        action: "insert_mistypes",
      };

      const response = await fetch(
        `${config.public.baseURL}/api/django/mistype/insert/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        resetMistypeStats();
        throw new Error();
      }

      resetMistypeStats();
    } catch (e) {
      throw new Error("ミスタイプデータの送信に失敗");
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
