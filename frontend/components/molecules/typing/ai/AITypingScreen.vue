<script setup lang="ts">
import { useTyping } from "~/composables/typing/japanese/ai/useTyping";
import { useErrorNotification } from "~/composables/common/useError";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import { useEventListener } from "@vueuse/core";

type KeyPressEvent = KeyboardEvent & { result: "correct" | "incorrect" };

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
const { $bus } = useNuxtApp();

/**
 * キー入力時の動作
 * @param event 
 */
const emitKeyPress = async (event: KeyboardEvent) => {
    const result = await handleKeyPress(event);
    $bus.$emit('key-press', { code: event.code, result: result } as KeyPressEvent);
    $bus.$emit('typing-stats', {
        totalCorrectTypedCount: typingResults.totalCorrectTypedCount,
        totalMistypedCount: typingResults.totalMistypedCount,
        typingAccuracy: typingResults.typingAccuracy
    });
};

useEventListener(window, 'keydown', emitKeyPress);

onMounted(async () => {
    const input = localStorage.getItem('ai-prompt') || 'タイピング';
    if (input) {
        initialize(input);
    }

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
    <BaseNotification v-if="resultNotification" :message="resultNotification.message" :content="resultNotification.content"
        :show="true" />
</template>

<style lang="scss" scoped>
.sentence-container {
    @extend %typing;
}
</style>