<script setup lang="ts">
import TypoFrequencyCard from '~/components/molecules/analyze/TypoFrequencyCard.vue';
import GrowthChartCard from '~/components/molecules/analyze/GrowthChartCard.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import BaseNotification from '~/components/molecules/common/BaseNotification.vue';
import { useAnalyze } from '~/composables/analyze/useAnalyze';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import { useErrorNotification } from '~/composables/common/useError';

const limit = 10;

const { typoFrequency, scoresByCombination,
    isLoading, error,
    getTypoFrequencyByLimit, getPastScores } = useAnalyze();
const { generateAllCombinations } = useLanguageAndDifficulty();
const { showErrorNotification } = useErrorNotification(error);

onMounted(async () => {
    const allCombinations = generateAllCombinations();

    const promises = allCombinations.map(async ({ languageId, difficultyId }) => {
        const key = `${languageId}-${difficultyId}`;
        const result: number[] | undefined = await getPastScores(languageId, difficultyId);
        return { key, scores: result || [] };
    });

    const [scoresResults] = await Promise.all([
        Promise.all(promises),
        getTypoFrequencyByLimit(limit)
    ]);

    scoresResults.forEach(({ key, scores }) => {
        scoresByCombination.value[key] = { scores };
    });

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
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
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