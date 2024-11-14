<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import type { RankingItem } from '~/types/ranking';

interface Props {
    difficultyName: string;
    rankings: RankingItem[] | RankingItem[][];
    width: "medium" | "small" | "large" | "xl" | "full";
    height: "medium" | "small" | "large" | "xl" | "full";
    limit: number;
    isFooter?: boolean;
}

const props = defineProps<Props>();

const topRankings = computed(() => {
    const rankingsArray = Array.isArray(props.rankings[0]) ? props.rankings[0] : props.rankings;
    return rankingsArray as RankingItem[];
});
</script>

<template>
    <BaseCard :width=props.width :height=props.height>
        <template #card-header>
            <div class="header-content">
                <Title size="small" :text="props.difficultyName" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-container">
                    <ul class="ranking-list">
                        <li v-for="index in props.limit" :key="index" class="ranking-item">
                            <Text v-if="topRankings[index - 1]" size="large" color="main-color">
                                {{ index }}位&nbsp;:&nbsp;{{ topRankings[index - 1].username }}&ensp;スコア&nbsp;:&nbsp;{{
                                    topRankings[index - 1].score }}
                            </Text>
                            <Text v-else size="large" color="sub-color">
                                {{ index }}位&nbsp;:&nbsp;データがありません
                            </Text>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
        <template #card-footer v-if="props.isFooter">
            <div class="footer-content">
                <Button border="main-color" width="same-as-input-large" height="medium" background="none"
                    :rounded="true" button-text="もっと見る" />
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.body-content {
    .ranking-list {
        list-style-type: none;
        padding: 0;

        .ranking-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4%;
            padding: 2%;
            border-bottom: 1px solid $translucent-white;
        }
    }
}

.footer-content {
    @include horizontal-centered-flex;
}
</style>