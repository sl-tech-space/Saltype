<script setup lang="ts">
import { useRanking } from '~/composables/ranking/useRanking';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';

const { getRanking } = useRanking();
const { generateAllCombinations } = useLanguageAndDifficulty();

const rankingsByCombination = ref<Record<string, Array<{ score: number }>>>({});
const isLoading = ref(true);

onMounted(async () => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせで過去３０回のスコアを取得
    for (const { languageId, difficultyId } of allCombinations) {
        const key = `${languageId}-${difficultyId}`;
        rankingsByCombination.value[key] = await getRanking(languageId, difficultyId);
    }

    isLoading.value = false;
});
</script>

<template>

</template>