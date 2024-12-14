import { ref, computed } from "vue";
import { useUser } from "../conf/useUser";

/**
 * ミスタイプキー処理
 * @returns mistypeCount,　totalMistypes,　countMistype,
 * resetMistypeStats, sendMistypeDataToServer,
 */
export function useMistype() {
  const config = useRuntimeConfig();
  const { user } = useUser();
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
  const _formatMistypeData = () => {
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
      if (!user.value) {
        console.error("ユーザ情報が存在しません");
        return;
      }

      const mistypes = _formatMistypeData();

      const dataToSend = {
        user_id: user.value.user_id,
        mistypes: mistypes,
        action: "insert_mistypes"
      };

      const response = await fetch(
        `${config.public.baseURL}/api/django/mistype/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        resetMistypeStats();
        throw new Error("ミスタイプデータの送信に失敗");
      }

      resetMistypeStats();
    } catch (e) {}
  };

  return {
    mistypeCount,
    totalMistypes,
    countMistype,
    resetMistypeStats,
    sendMistypeDataToServer,
  };
}
