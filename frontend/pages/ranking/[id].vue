<script setup lang="ts">
import RankingHeader from '~/components/organisms/ranking/RankingHeader.vue';
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';
import { useRanking } from '~/composables/ranking/useRanking';

const { rankingDetails, detailsTitle, getRankingDetailsByIdAndLimitParam } = useRanking();

const route = useRoute();
const limit = 21;

onMounted(async () => {
    const id = route.params.id as string;
    await getRankingDetailsByIdAndLimitParam(id, limit);

    useHead({
        title: "ランキング詳細 | Saltype"
    })
})
</script>

<template>
    <CursorEffect />
    <div class="page">
        <RankingHeader title="ランキング詳細" backName="ranking" />
        <BaseRankingCard :difficultyName="detailsTitle" :rankings="rankingDetails" width="full" height="large"
            :limit=limit :isFooter="false" :isGrid="true" />
    </div>
    <CopyRight />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
    @include hidden;
}
</style>