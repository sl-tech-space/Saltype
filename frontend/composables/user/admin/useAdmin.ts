/**
 * ユーザ管理画面関数
 * @returns 
 */
export function useAdmin() {
    const config = useRuntimeConfig();
    const userItems = ref([]);
    const message = ref("");
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    /**
     * 全ユーザ取得
     */
    const getAllUserInfo = async () => {
        isLoading.value = true;

        try {
            const response = await fetch(
                `${config.public.baseURL}/api/django/user/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: AbortSignal.timeout(5000),
                }
            );

            if (!response.ok) {
                error.value = "全ユーザデータの取得に失敗しました";
                return;
            }

            const responseData = await response.json();

            userItems.value = responseData.data;
        } catch (e) {
            error.value = "ネットワークエラーが発生しました。接続を確認してください。";
        }
    }

    /**
     * 指定したユーザを削除
     * @param userId 
     */
    const deleteUserInfo = async (userId: string) => {
        try {
            const response = await fetch(
                `${config.public.baseURL}/api/django/user/delete/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                    }),
                    signal: AbortSignal.timeout(5000),
                }
            );

            if (!response.ok) {
                error.value = "ユーザの削除に失敗しました";
                return;
            }

            message.value = "ユーザの削除に成功しました。"
        } catch (e) {
            error.value = "ネットワークエラーが発生しました。接続を確認してください。";
        }
    }

    return {
        getAllUserInfo,
        deleteUserInfo,
        userItems,
        message,
        isLoading,
        error,
    };
}