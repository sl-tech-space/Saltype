<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import type { RankingItem } from '~/types/ranking.d';

interface Props {
    id?: string;
    difficultyName?: string;
    rankings: RankingItem[] | RankingItem[][];
    width: "medium" | "small" | "large" | "xl" | "full";
    height: "medium" | "small" | "large" | "xl" | "full";
    size?: "medium" | "small" | "large";
    limit: number;
    isFooter?: boolean;
    isGrid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    size: "large",
    isFooter: true,
    isGrid: false
});

const topRankings = computed(() => {
    const rankingsArray = Array.isArray(props.rankings[0]) ? props.rankings[0] : props.rankings;
    return rankingsArray as RankingItem[];
});

const navigateToDetails = async () => {
    await navigateTo({ name: `ranking-id`, params: { id: props.id } });
}

onMounted(() => {
    if (props.isGrid) {
        const target = document.getElementById('ranking-list');
        target?.style.setProperty('display', 'grid');
        target?.style.setProperty('grid-template-columns', 'repeat(3, 1fr)');
    }
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
                    <ul class="ranking-list" id="ranking-list">
                        <li v-for="index in props.limit" :key="index" class="ranking-item" id="ranking-item">
                            <Text v-if="topRankings[index - 1]" :size="props.size" color="main-color">
                                {{ index }}位&nbsp;:&nbsp;{{ topRankings[index - 1].username }}&ensp;スコア&nbsp;:&nbsp;{{
                                    topRankings[index - 1].score }}
                            </Text>
                            <Text v-else :size="props.size" color="sub-color">
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
                    :is-rounded="true" button-text="もっと見る" @click="navigateToDetails" />
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.header-content {
    @include horizontal-centered-flex
}

.body-content {
    .ranking-list {
        list-style-type: none;
        padding: 0;

        .ranking-item {
            display: flex;
            justify-content: center;
            margin-bottom: 2%;
            padding: 1%;
            border-bottom: 1px solid $translucent-white;
        }
    }
}

.footer-content {
    @include horizontal-centered-flex;
}
</style>