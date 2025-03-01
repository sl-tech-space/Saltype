<script setup lang="ts">
import { useTyping } from "~/composables/typing/useTyping";
import { useErrorNotification } from "~/composables/common/useError";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "../common/BaseNotification.vue";
import { useEventListener } from "@vueuse/core";

const route = useRoute();
const splittedId = splitId(route.params.id as string);
const language = ref(splittedId.left.toString());
const difficultyLevel = ref(splittedId.right.toString());

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
    handleKeyPress,
    finishTyping,
    initialize,
} = useTyping(language.value, difficultyLevel.value);
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

onMounted(() => {
    initialize();
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
                <div v-if="splittedId.left === 1">
                    <Title color="main-color" size="medium" :text="isTypingStarted ? currentSentence.sentence[0]
                        : (isCountdownActive ? countdown.toString() : 'Enterキーで開始します')" />
                    <template v-if="isTypingStarted">
                        <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                        <Text color="main-color" size="large" v-html="coloredText" />
                    </template>
                </div>
                <div v-if="splittedId.left === 2">
                    <div v-if="!isTypingStarted">
                        <Title color="main-color" :text="isCountdownActive ? countdown.toString() : 'Enterキーで開始します'" />
                    </div>
                    <div v-else>
                        <Title color="main-color" v-html="coloredText" class="english-text" />
                        <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                    </div>
                </div>
            </div>
            <Text v-else color="main-color" size="large" text="Loading..." />
        </div>
        <Separator color="sub-color" width="medium" />
    </main>
    <Loading :is-loading="isLoading" />
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
</template>

<style lang="scss" scoped>
.sentence-container {
    @extend %typing;
}

@media (max-width: 1366px) {
    .english-text {
        font-size: 1em;
    }
}

@media (min-width: 1366px) and (max-width: 1440px) {
    .english-text {
        font-size: 1.1em;
    }
}

@media (min-width: 1440px) and (max-width: 1670px) {
    .english-text {
        font-size: 1.4em;
    }
}

@media (min-width: 1670px) {
    .english-text {
        font-size: 1.6em;
    }
}
</style>