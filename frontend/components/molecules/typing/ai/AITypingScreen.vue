<script setup lang="ts">
import { useTyping } from "~/composables/typing/japanese/ai/useTyping";
import { useErrorNotification } from "~/composables/common/useError";
import { useLocalStorage } from '~/composables/common/useLocalStorage';
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import PromptSettingModal from '../ai/PromptSettingModal.vue';
import { useEventListener } from "@vueuse/core";

type KeyPressEvent = KeyboardEvent & { result: "correct" | "incorrect" };

const showPromptModal = ref(true);
const { setValue: setPromptValue } = useLocalStorage('prompt', 'タイピング');

const {
    typingResults,
    currentSentence,
    coloredText,
    countdown,
    isTypingStarted,
    isCountdownActive,
    isLoading,
    error,
    resultNotification,
    handleKeyPress,
    finishTyping,
    initialize,
} = useTyping();

const { showErrorNotification } = useErrorNotification(error);

const handlePromptSubmit = async (prompt: string) => {
    try {
        isLoading.value = true;
        setPromptValue(prompt);
        await initialize(prompt);
        showPromptModal.value = false; // 成功時にモーダルを閉じる
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message;
        } else {
            error.value = '予期せぬエラーが発生しました';
        }
        showPromptModal.value = true; // エラー時にモーダルを再表示
    } finally {
        isLoading.value = false;
    }
};

// エラー監視を修正
watch([error, currentSentence], ([newError, newSentence]) => {
    // エラーが発生した場合、またはsentenceが空の場合にモーダルを表示
    if (newError || !newSentence) {
        showPromptModal.value = true;
    }
});

const { $bus } = useNuxtApp();

const emitKeyPress = async (event: KeyboardEvent) => {
    const result = await handleKeyPress(event);

    $bus.$emit('key-press', { code: event.code, result } as KeyPressEvent);
    $bus.$emit('typing-stats', {
        totalCorrectTypedCount: typingResults.totalCorrectTypedCount,
        totalMistypedCount: typingResults.totalMistypedCount,
        typingAccuracy: typingResults.typingAccuracy
    });
};

useEventListener(window, 'keydown', emitKeyPress);

onMounted(async () => {
    showPromptModal.value = true;

    $bus.$on('timer-ended', () => {
        isLoading.value = true;
        finishTyping();
        isLoading.value = false;
    });
});

onUnmounted(() => {
    $bus.$off('timer-ended');
    $bus.$off('typing-stats');
});
</script>

<template>
    <main class="sentence-container">
        <div>
            <div v-if="currentSentence">
                <Title color="main-color" size="medium" :text="isTypingStarted ? currentSentence.sentence[0]
                    : (isCountdownActive ? countdown.toString() : 'Enterキーで開始します')" />
                <template v-if="isTypingStarted">
                    <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                    <Text color="main-color" size="large" v-html="coloredText" />
                </template>
            </div>
            <Text v-else color="main-color" size="large" text="Loading..." />
        </div>
        <Separator color="sub-color" width="medium" />
    </main>
    <Loading :is-loading="isLoading" />
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
    <BaseNotification v-if="resultNotification" :message="resultNotification.message"
        :content="resultNotification.content" :show="true" />
    <ClientOnly>
        <Suspense>
            <PromptSettingModal v-model="showPromptModal" @submit="handlePromptSubmit" />
        </Suspense>
    </ClientOnly>
</template>

<style lang="scss" scoped>
.sentence-container {
    @extend %typing;
}
</style>