<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import ScrollHandler from "~/composables/ui/ScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import Loading from "~/composables/ui/Loading.vue";
import { useRanking } from '~/composables/ranking/useRanking';

const { isLoading, japaneseRankings, englishRankings, getRankingByLimitParam } = useRanking();
const rankingDataLimit = 5;

onMounted(async () => {
  await getRankingByLimitParam(rankingDataLimit);
});

onMounted(() => {
  useHead({
    title: "ランキング"
  })
})
</script>

<template>
  <CursorEffect />
  <ScrollHandler />
  <div class="page">
    <RankingHeader title="ランキング" />
  </div>
  <div class="second-page">
    <RankingHeader title="日本語" />
    <JapaneseRankingCard :rankings-by-combination="japaneseRankings" />
  </div>
  <div class="second-page">
    <RankingHeader title="英語" />
    <EnglishRankingCard :rankings-by-combination="englishRankings" />
  </div>
  <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}

.second-page {
  @extend %full-page;
}
</style>
