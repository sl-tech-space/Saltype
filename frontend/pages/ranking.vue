<script setup lang="ts">
import CursorEffect from "~/composables/ui/useCursorEffect.vue";
import ScrollHandler from "~/composables/ui/useScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import Loading from "~/composables/ui/useLoading.vue";
import { useRanking } from '~/composables/ranking/useRanking';

const { isLoading, japaneseRankings, englishRankings, getRankingByLimitParam } = useRanking();
const rankingDataLimit: number = 5;
const isTouchpad = ref<boolean>(false);

onMounted(async () => {
  await getRankingByLimitParam(rankingDataLimit);

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    isTouchpad.value = true;
  }
});

onMounted(() => {
  useHead({
    title: "ランキング"
  })
})
</script>

<template>
  <CursorEffect v-if="!isTouchpad"/>
  <ScrollHandler />
  <div class="page">
    <RankingHeader title="ランキング" />
  </div>
  <div class="page">
    <RankingHeader title="日本語" />
    <JapaneseRankingCard :rankings-by-combination="japaneseRankings" />
  </div>
  <div class="page">
    <RankingHeader title="英語" />
    <EnglishRankingCard :rankings-by-combination="englishRankings" />
  </div>
  <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
