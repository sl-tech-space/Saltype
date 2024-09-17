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
  initialize,
} = useTyping(language.value, difficultyLevel.value);

onMounted(initialize);
</script>

<template>
    <section>
        <div class="sentence-container">
            <span>
                <div v-if="currentSentence">
                    <div v-if="!isTypingStarted">
                        <Title color="blue" size="medium" :text="isCountdownActive ? countdown.toString() : 'Enterキーで開始します'" />
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
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing.scss" />