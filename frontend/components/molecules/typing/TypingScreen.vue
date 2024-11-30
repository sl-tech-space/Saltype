<script setup lang="ts">
import { useTyping } from "~/composables/typing/useTyping";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import { useEventListener } from "@vueuse/core";

const route = useRoute();
const splitedId = splitId(route.params.id as string);
const language = ref(splitedId.left.toString());
const difficultyLevel = ref(splitedId.right.toString());
let isLoading = ref(false);

const {
    currentSentence,
    coloredText,
    isTypingStarted,
    countdown,
    isCountdownActive,
    handleKeyPress,
    finishTyping,
    initialize,
} = useTyping(language.value, difficultyLevel.value);

const { $bus } = useNuxtApp();

type KeyPressEvent = KeyboardEvent & { result: "correct" | "incorrect" };

const emitKeyPress = (event: KeyPressEvent) => {
    const result = handleKeyPress(event);
    $bus.$emit('key-press', { code: event.code, result: result } as KeyPressEvent);
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
});
</script>

<template>
    <main class="sentence-container">
        <div>
            <div v-if="currentSentence">
                <div v-if="splitedId.left === 1">
                    <Title color="main-color" size="medium" :text="isTypingStarted ? currentSentence.sentence[0]
                        : (isCountdownActive ? countdown.toString() : 'Enterキーで開始します')" />
                    <template v-if="isTypingStarted">
                        <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                        <Text color="main-color" size="large" v-html="coloredText" />
                    </template>
                </div>
                <div v-if="splitedId.left === 2">
                    <div v-if="!isTypingStarted">
                        <Title color="main-color" size="medium"
                            :text="isCountdownActive ? countdown.toString() : 'Enterキーで開始します'" />
                    </div>
                    <div v-else>
                        <Title color="main-color" size="small" v-html="coloredText" />
                        <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                    </div>
                </div>
            </div>
            <Text v-else color="main-color" size="large" text="Loading..." />
        </div>
        <Separator color="sub-color" width="medium" />
    </main>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.sentence-container {
    @extend %typing;
}
</style>