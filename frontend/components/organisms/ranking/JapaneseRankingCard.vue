<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import type { RankingItem } from '~/types/ranking.d';

interface Props {
    rankingsByCombination: Record<string, RankingItem[]>;
    rankingDataLimit: number;
}

const props = defineProps<Props>();
const japaneseDifficultyIds = ['1-1', '1-2', '1-3'];

const { getDifficultyName } = useLanguageAndDifficulty();
</script>

<template>
    <main class="ranking-cards-container">
        <div class="ranking-cards">
            <BaseRankingCard v-for="id in japaneseDifficultyIds" :key="id"
                :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                :rankings="objectToRankingItem(props.rankingsByCombination[id] || [])" width="medium" height="full"
                :limit=rankingDataLimit :is-footer="true" :id="id" :is-margin="true" />
        </div>
    </main>
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