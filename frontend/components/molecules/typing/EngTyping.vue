<script setup lang="ts">
import { useTyping } from "~/composables/typing/useTyping";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/composables/ui/Loading.vue";

const route = useRoute();
const language = ref(route.query.language as string || "0");
const difficultyLevel = ref(route.query.difficultyLevel as string || "0");
let isLoading = ref(false);

const {
    currentSentence,
    coloredText,
    isTypingStarted,
    countdown,
    isCountdownActive,
    finishTyping,
    initialize,
} = useTyping(language.value, difficultyLevel.value);

const { $bus } = useNuxtApp();

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
                <div v-if="!isTypingStarted">
                    <Title color="main-color" size="medium"
                        :text="isCountdownActive ? countdown.toString() : 'Enterキーで開始します'" />
                </div>
                <div v-else>
                    <Title color="main-color" size="small" v-html="coloredText" />
                    <Text color="main-color" size="large" :text="currentSentence.sentence[1]" />
                </div>
            </div>
            <Text v-else color="main-color" size="large" text="Loading..." />
        </div>
        <Separator color="sub-color" width="medium" />
    </main>
    <Loading :isLoading="isLoading" />
</template>

<style lang="scss" scoped>
.sentence-container {
    @extend %typing;
}
</style>