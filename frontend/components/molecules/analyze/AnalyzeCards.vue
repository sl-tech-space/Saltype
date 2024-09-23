<script setup lang="ts">
import TypoFrequencyCard from './cards/TypoFrequencyCard.vue';
import GrowthChartCard from './cards/GrowthChartCard.vue';
import Loading from '~/composables/ui/Loading.vue';
import { useAnalyze } from '~/composables/analyze/useAnalyze';
import { useLanguageAndDifficulty, Language, Difficulty } from '~/composables/typing/useLanguageAndDifficulty';

const { typoFrequencyTop3, getTypoFrequencyTop3, getPastScores } = useAnalyze();
const { generateAllCombinations } = useLanguageAndDifficulty();

// 各設定ごとのスコアを保持するためのreactive変数
const scoresByCombination = ref<Record<string, Array<{ score: number }>>>({});
const isLoading = ref(true);

onMounted(async () => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせで過去３０回のスコアを取得
    for (const { languageId, difficultyId } of allCombinations) {
        const key = `${languageId}-${difficultyId}`;
        scoresByCombination.value[key] = await getPastScores(languageId, difficultyId);

        console.log(`Scores for ${key}:`, scoresByCombination.value[key]);
    }

    console.log("送信する値", scoresByCombination.value["1-1"])

    await getTypoFrequencyTop3();

    isLoading.value = false;
});
</script>

<template>
    <div class="analyze-cards-container">
        <div class="left-card">
            <GrowthChartCard :scoresByCombination="scoresByCombination" />
        </div>
        <div class="right-card">
            <TypoFrequencyCard :typoFrequencyTop3="typoFrequencyTop3" />
        </div>
    </div>
    <Loading :isLoading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/analyze-cards.scss" />