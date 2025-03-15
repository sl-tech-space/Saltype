<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import type { RankingItem } from '~/types/ranking.d';

interface Props {
    dailyJapaneseRankingsByCombination: Record<string, RankingItem[]>;
    dailyEnglishRankingsByCombination: Record<string, RankingItem[]>;
    dailyRankingDataLimit: number;
}

const props = defineProps<Props>();
const japaneseDifficultyIds = ['1-1', '1-2', '1-3'];
const englishDifficultyIds = ['2-1', '2-2', '2-3'];

const { getDifficultyName } = useLanguageAndDifficulty();
</script>

<template>
    <main class="ranking-cards-container">
        <div class="content">
            <Title size="small" text="日本語" />
            <div class="ranking-cards">
                <BaseRankingCard v-for="id in japaneseDifficultyIds" :key="id"
                    :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                    :rankings="objectToRankingItem(props.dailyJapaneseRankingsByCombination[id] || [])" width="medium"
                    height="full" :limit=props.dailyRankingDataLimit :is-footer="false" :is-margin="true" />
            </div>
        </div>
        <div class="content">
            <Title size="small" text="英語" class="daily-champion-title" />
            <div class="ranking-cards">
                <BaseRankingCard v-for="id in englishDifficultyIds" :key="id"
                    :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                    :rankings="objectToRankingItem(props.dailyEnglishRankingsByCombination[id] || [])" width="medium"
                    height="full" :limit=props.dailyRankingDataLimit :is-footer="false" :is-margin="true" />
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.ranking-cards-container {
    width: 100%;
    height: 75vh;
    @include vertical-flex;
    text-align: center;
    justify-content: space-around;

    .ranking-cards {
        @include horizontal-flex;
        justify-content: space-around;
    }
}
</style>