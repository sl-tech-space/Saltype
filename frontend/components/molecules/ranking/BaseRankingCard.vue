<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Title from '~/components/atoms/texts/Title.vue';
import type { RankingProps } from '~/composables/ranking/useRankingTypes';

interface Props {
  difficultyName: string;
  rankingData: {
    scores: Array<{
      user_id: string;
      username: string;
      score: number;
    }>;
  };
}

const props = defineProps<Props>();

// 表示するランキングの数を制限（例：上位5件）
const topRankings = computed(() => props.rankings.scores.slice(0, 5));
</script>

<template>
    <BaseCard width="large" height="full">
        <template #card-header>
            <div class="header-content">
                <Title size="small">
                    {{ props.difficultyName }} ランキング
                </Title>
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-container">
                    <ul class="ranking-list">
                        <li v-for="(ranking, index) in topRankings" :key="index" class="ranking-item">
                            <span class="rank">{{ index + 1 }}</span>
                            <span class="score">{{ ranking.score }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button 
                    border="sub-color" 
                    width="same-as-input-large" 
                    height="medium" 
                    background="none" 
                    :rounded="true"
                    button-text="もっと見る >>>" 
                />
            </div>
        </template>
    </BaseCard>
</template>

<style scoped>
.ranking-list {
    list-style-type: none;
    padding: 0;
}

.ranking-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 5px;
    border-bottom: 1px solid #eee;
}

.rank {
    font-weight: bold;
    margin-right: 10px;
}

.score {
    font-weight: bold;
}
</style>