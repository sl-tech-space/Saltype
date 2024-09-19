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
    totalTypedCount,
    totalMistypeCount,
    typingAccuracy,
    currentSentence,
    coloredText,
    isTypingStarted,
    countdown,
    isCountdownActive,
    sendMistypeDataToServer,
    initialize,
} = useTyping(language.value, difficultyLevel.value);

const { $bus } = useNuxtApp();

onMounted(() => {
    initialize();
    $bus.$on('timer-ended', () => {
        isLoading.value = true;
        sendMistypeDataToServer(
            totalTypedCount,
            totalMistypeCount,
            typingAccuracy
        )
        isLoading.value = false;
    });
});

onUnmounted(() => {
    $bus.$off('timer-ended');
});
</script>

<template>
    <section>
        <div class="sentence-container">
            <span>
                <div v-if="currentSentence">
                    <div v-if="!isTypingStarted">
                        <Title color="blue" size="medium"
                            :text="isCountdownActive ? countdown.toString() : 'Enterキーで開始します'" />
                    </div>
                    <div v-else>
                        <Title color="blue" size="small" v-html="coloredText" />
                        <Text color="blue" size="large" :text="currentSentence.sentence[1]" />
                    </div>
                </div>
                <Text v-else color="blue" size="large" text="Loading..." />
            </span>
        </div>
        <Separator color="dark-blue" width="medium" />
    </section>
    <Loading :isLoading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing.scss" />