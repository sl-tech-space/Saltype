<script setup lang="ts">
import TypoFrequencyCard from '~/components/molecules/analyze/TypoFrequencyCard.vue';
import GrowthChartCard from '~/components/molecules/analyze/GrowthChartCard.vue';
import Loading from '~/composables/ui/useLoading.vue';
import { useAnalyze } from '~/composables/analyze/useAnalyze';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';

const { typoFrequency, getTypoFrequencyByLimitParam, getPastScores } = useAnalyze();
const { generateAllCombinations } = useLanguageAndDifficulty();

// 各設定ごとのスコアを保持するためのreactive変数
const scoresByCombination = ref<Record<string, Array<{ score: number }>>>({});
const limit = 10;
const isLoading = ref(true);

onMounted(async () => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせで過去３０回のスコアを取得
    for (const { languageId, difficultyId } of allCombinations) {
        const key = `${languageId}-${difficultyId}`;
        scoresByCombination.value[key] = await getPastScores(languageId, difficultyId);
    }

    await getTypoFrequencyByLimitParam(limit);

    isLoading.value = false;
});
</script>

<template>
    <main class="analyze-cards-container">
        <div class="left-card">
            <GrowthChartCard :scoresByCombination="scoresByCombination" />
        </div>
        <div class="right-card">
            <TypoFrequencyCard :typoFrequency="typoFrequency" :limit="limit" />
        </div>
    </main>
    <Loading :isLoading="isLoading" />
</template>

<style lang="scss" scoped>
.analyze-cards-container {
    width: 100%;
    height: 75vh;
    position: relative;
    display: flex;
    justify-content: space-around;
    gap: 5%;

    .left-card {
        flex: 6;
        width: 50%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .right-card {
        flex: 4;
        display: flex;
        align-items: center;
    }
}
</style>