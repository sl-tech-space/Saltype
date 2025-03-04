import { describe, it, expect } from "vitest";
import { ref, nextTick } from "vue";
import { useErrorNotification } from "../../../composables/common/useError";

describe("useErrorNotification", () => {
  it("エラーがnullの場合、通知は表示されない", () => {
    const error = ref<string | null>(null);
    const { showErrorNotification } = useErrorNotification(error);

    expect(showErrorNotification.value).toBe(false);
  });

  it("エラーが設定された場合、通知が表示される", async () => {
    const error = ref<string | null>(null);
    const { showErrorNotification } = useErrorNotification(error);

    error.value = "エラーが発生しました";
    await nextTick();

    expect(showErrorNotification.value).toBe(true);
  });

  it("エラーがnullからエラーメッセージに変更された場合、通知が表示される", async () => {
    const error = ref<string | null>(null);
    const { showErrorNotification } = useErrorNotification(error);

    expect(showErrorNotification.value).toBe(false);

    error.value = "エラーが発生しました";
    await nextTick();

    expect(showErrorNotification.value).toBe(true);
  });

  it("エラーメッセージが変更された場合も通知は表示される", async () => {
    const error = ref<string | null>("最初のエラー");
    const { showErrorNotification } = useErrorNotification(error);

    error.value = "新しいエラー";
    await nextTick();

    expect(showErrorNotification.value).toBe(true);
  });
});
