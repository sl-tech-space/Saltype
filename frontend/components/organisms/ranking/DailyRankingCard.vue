<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';
import type { RankingItem } from '~/types/ranking';

interface Props {
    dailyJapaneseRankingsByCombination: Record<string, RankingItem[]>;
    dailyEnglishRankingsByCombination: Record<string, RankingItem[]>;
    dailyRankingDataLimit: number;
}

const props = defineProps<Props>();

const { getDifficultyName } = useLanguageAndDifficulty();

const japaneseDifficultyIds = ['1-1', '1-2', '1-3'];
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
        <Title text="本日のチャンピオン" />
        <Separator color="sub-color" width="medium" margin="none" :visible="true" />
        <Title size="small" text="日本語" class="daily-champion-title" />
        <div class="ranking-cards">
            <BaseRankingCard v-for="id in japaneseDifficultyIds" :key="id"
                :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                :rankings="objectToArray(props.dailyJapaneseRankingsByCombination[id] || [])" width="medium"
                height="full" :limit=props.dailyRankingDataLimit :is-footer="false" :is-margin="true" />
        </div>
        <Title size="small" text="英語" class="daily-champion-title" />
        <div class="ranking-cards">
            <BaseRankingCard v-for="id in englishDifficultyIds" :key="id"
                :difficulty-name="getDifficultyName(Number(id.split('-')[1]))"
                :rankings="objectToArray(props.dailyEnglishRankingsByCombination[id] || [])" width="medium"
                height="full" :limit=props.dailyRankingDataLimit :is-footer="false" :is-margin="true" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ranking-cards-container {
    width: 100%;
    height: 80vh;
    @include vertical-centered-flex;

    .daily-champion-title {
        margin-top: 1%;
    }

    .ranking-cards {
        @include horizontal-flex;
        justify-content: space-around;
    }
}
</style>