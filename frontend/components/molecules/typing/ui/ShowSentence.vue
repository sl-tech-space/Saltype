<script setup lang="ts">
import { useSentence } from "~/composables/server/useSentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";

const route = useRoute();
const language = ref("");
const difficultyLevel = ref("");
const sentencesData = ref<Array<[string, string]>>([]); // [漢字を含めた文章][全てひらがな]
const currentIndex = ref(0);
const patterns = ref<string[]>([]);

const currentSentence = computed(() => {
  const sentence = sentencesData.value[currentIndex.value];
  return sentence
    ? {
        sentence: sentence,
        patterns: patterns.value
      }
    : null;
});

const nextSentence = () => {
    if (currentIndex.value < sentencesData.value.length - 1) {
        currentIndex.value++;
    }
};

onMounted(async () => {
    language.value = route.query.language as string || "0";
    difficultyLevel.value = route.query.difficultyLevel as string || "0";

    const { sentences } = useSentence(language.value, difficultyLevel.value);

    try {
        const data = await sentences();
        if (Array.isArray(data) && data.length > 0) {
            sentencesData.value = data;
        } else {
            console.error("Invalid data received:", data);
        }
    } catch (error) {
        console.error("文章の取得に失敗しました:", error);
    }

    const { getPatternList, getAllCombinations } = useSentencePattern();
    patterns.value = await getAllCombinations(await getPatternList(sentencesData.value[currentIndex.value][1]));

    console.log(patterns.value)
});
</script>

<template>
    <section>
        <div class="sentence-container">
            <span>
                <div v-if="currentSentence">
                    <Title color="blue" size="medium" :text="currentSentence.sentence[0]" />
                    <Text color="blue" size="large" :text="currentSentence.sentence[1]" />
                    <Text v-if="currentSentence" color="blue" size="large" :text="currentSentence.patterns[0]" />
                </div>
                <div v-else>
                    <Text color="blue" size="large" text="Loading..." />
                </div>
            </span>
        </div>
        <Separator color="dark-blue" width="medium" />
    </section>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/show-sentence.scss" />