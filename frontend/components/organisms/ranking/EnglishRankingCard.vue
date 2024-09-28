<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import type { RankingItem } from '~/composables/ranking/useRankingTypes';

interface Props {
    rankingsByCombination: Record<string, RankingItem[]>;
}

const props = defineProps<Props>();

const { getDifficultyName } = useLanguageAndDifficulty();

const englishDifficultyIds = ['2-1', '2-2', '2-3'];

const objectToArray = (obj: Record<string, RankingItem> | RankingItem[]): RankingItem[] => {
    if (Array.isArray(obj)) {
        return obj;
    }
    return Object.values(obj);
};
</script>

<template>
    <div class="ranking-cards-container">
        <div class="ranking-cards">
            <BaseRankingCard v-for="id in englishDifficultyIds" :key="id"
                :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                :rankings="objectToArray(props.rankingsByCombination[id] || [])" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ranking-cards-container {
    width: 100%;
    height: 75vh;
    @include vertical-centered-flex;

    .ranking-cards {
        @include horizontal-flex;
        justify-content: space-around;
    }
}
</style>