/**
 * エラー発生時の共通動作
 */
export function useErrorNotification(error: Ref<string | null, string | null>) {
  const showErrorNotification = ref(false);

  watch(error, (newError) => {
    if (newError) {
      showErrorNotification.value = true;
    }
  });

  return {
    showErrorNotification,
  };
}
