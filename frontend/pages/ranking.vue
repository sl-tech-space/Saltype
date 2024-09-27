<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import { useRanking } from '~/composables/ranking/useRanking';

const { japaneseRankings, englishRankings, getRankingByLimitParam } = useRanking();
const rankingDataLimit = 5;

onMounted(async () => {
  await getRankingByLimitParam(rankingDataLimit);
  console.log(japaneseRankings);
  console.log(englishRankings);
});

onMounted(() => {
  useHead({
    title: "ランキング"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <RankingHeader />
  </div>
  <div class="second-page">
    <JapaneseRankingCard :rankings-by-combination="japaneseRankings" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}

.second-page {
  @extend %full-page;
}
</style>
