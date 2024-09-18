<script setup lang="ts">
import { useTyping } from "~/composables/typing/useTyping";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";

const route = useRoute();
const language = ref(route.query.language as string || "0");
const difficultyLevel = ref(route.query.difficultyLevel as string || "0");

const {
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
    sendMistypeDataToServer()
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
                    <Title color="blue" size="medium" :text="isTypingStarted ? currentSentence.sentence[0]
                        : (isCountdownActive ? countdown.toString() : 'Enterキーで開始します')" />
                    <template v-if="isTypingStarted">
                        <Text color="blue" size="large" :text="currentSentence.sentence[1]" />
                        <Text color="blue" size="large" v-html="coloredText" />
                    </template>
                </div>
                <Text v-else color="blue" size="large" text="Loading..." />
            </span>
        </div>
        <Separator color="dark-blue" width="medium" />
    </section>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing.scss" />