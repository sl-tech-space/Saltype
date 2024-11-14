<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import type { RankingItem } from '~/types/ranking';

interface Props {
    rankingsByCombination: Record<string, RankingItem[]>;
    rankingDataLimit: number;
}

const props = defineProps<Props>();

const { getDifficultyName } = useLanguageAndDifficulty();

const japaneseDifficultyIds = ['1-1', '1-2', '1-3'];

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
            <BaseRankingCard v-for="id in japaneseDifficultyIds" :key="id"
                :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                :rankings="objectToArray(props.rankingsByCombination[id] || [])" width="medium" height="full"
                :limit=rankingDataLimit :is-footer="true" />
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