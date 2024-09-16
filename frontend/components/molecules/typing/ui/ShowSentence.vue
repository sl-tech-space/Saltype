<script setup lang="ts">
import { useSentence } from "~/composables/server/useSentence";
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Separator from "~/components/atoms/ui/Separator.vue";

const route = useRoute();

const language = ref("");
const difficultyLevel = ref("");
const sentencesData = ref<Array<[string, string]>>([]); // [漢字を含めた文章][全てひらがな]
const currentIndex = ref(0);

const currentSentence = computed(() => {
    return sentencesData.value[currentIndex.value] || null;
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
});
</script>

<template>
    <section>
        <div class="sentence-container">
            <span>
                <div v-if="currentSentence">
                    <Title color="blue" size="medium" :text="currentSentence[0]" />
                    <Text color="blue" size="large" :text="currentSentence[1]" />
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