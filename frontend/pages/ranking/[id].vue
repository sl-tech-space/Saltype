<script setup lang="ts">
import RankingHeader from '~/components/organisms/ranking/RankingHeader.vue';
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import { useRanking } from '~/composables/ranking/useRanking';

const { rankingDetails, detailsTitle, getRankingDetailsByIdAndLimitParam } = useRanking();

const route = useRoute();
const limit = 21;

onMounted(async () => {
    const id = route.params.id as string;
    await getRankingDetailsByIdAndLimitParam(id, limit);
})

onMounted(() => {
    useHead({
        title: "ランキング詳細"
    })
})
</script>

<template>
    <div class="page">
        <RankingHeader title="ランキング詳細" backName="ranking" />
        <BaseRankingCard :difficultyName="detailsTitle" :rankings="rankingDetails" width="full" height="large"
            :limit=limit :isFooter="false" :isGrid="true" />
    </div>
</template>

<style lang="scss" scoped>
.page {
    overflow: hidden;
    @extend %full-page;
}
</style>