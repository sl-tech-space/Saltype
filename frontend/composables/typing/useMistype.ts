import { ref, computed } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import { useSession } from "../server/useSession";

export function useMistype() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();
  const mistypeCount = ref<Record<string, number>>({});

  const totalMistypes = computed(() => {
    return Object.values(mistypeCount.value).reduce((sum, count) => sum + count, 0);
  });

  const countMistype = (key: string) => {
    console.log('Counting mistype for key:', key);
    mistypeCount.value = { 
      ...mistypeCount.value, 
      [key]: (mistypeCount.value[key] || 0) + 1 
    };
    console.log('Updated mistypeCount:', JSON.stringify(mistypeCount.value, null, 2));
  };

  const resetMistypeStats = () => {
    mistypeCount.value = {};
  };

  const formatMistypeData = () => {
    return Object.entries(mistypeCount.value).map(([miss_char, miss_count]) => ({
      miss_char,
      miss_count,
    }));
  };

  const sendMistypeDataToServer = async () => {
    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("User session or user_id not available");
        return;
      }

      console.log('Current mistypeCount before sending:', JSON.stringify(mistypeCount.value, null, 2));

      const missData = formatMistypeData();

      const dataToSend = {
        user_id: user.user_id,
        miss_data: missData,
      };
  
      console.log('Data being sent to server:', JSON.stringify(dataToSend, null, 2));

      const response = await fetch(`${config.public.baseURL}/api/mistypes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("ミスタイプデータの送信に失敗");
      }

      console.log("Mistype data sent successfully");

      // データ送信後にリセット
      resetMistypeStats();
    } catch (error) {
      console.error("Error sending mistype data:", error);
    }
  };

  return {
    mistypeCount,  // mistypeCountを直接返す
    totalMistypes,
    countMistype,
    resetMistypeStats,
    sendMistypeDataToServer,
  };
}