import { useUserInfo } from "~/composables/common/useUserInfo";

/**
 * ユーザ設定画面処理
 * @returns getUserInfo, userItem, isLoading, error
 */
export function useSetting() {
    const config = useRuntimeConfig();
    const userItem = ref();
    const { user, waitForUser } = useUserInfo();
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    /**
     * 現在のユーザ情報を取得
     */
    const getUserInfo = async (): Promise<void> => {
        isLoading.value = true;
        try {
            await waitForUser();

            if (!user.value) {
                error.value = "ユーザ情報が存在しません";
                return;
            }

            const response = await fetch(
                `${config.public.baseURL}/api/django/user/${user.value.user_id}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: AbortSignal.timeout(5000),
                }
            );

            if (!response.ok) {
                error.value = "ユーザ情報の取得に失敗しました";
                return;
            }

            const responseData = await response.json();

            userItem.value = responseData.data;
        } catch (e) {
            error.value =
                "ネットワークエラーが発生しました。接続を確認してください。";
        } finally {
            isLoading.value = false;
        }
    };

    return {
        getUserInfo,
        userItem,
        isLoading,
        error
    }
}