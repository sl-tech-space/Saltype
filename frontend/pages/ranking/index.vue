<script setup lang="ts">
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import ScrollHandler from "~/components/molecules/common/ui/ScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import DailyRankingCard from "~/components/organisms/ranking/DailyRankingCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import PageIndicator from "~/components/molecules/common/ui/PageIndicator.vue";
import { useRanking } from '~/composables/ranking/useRanking';

const {
  isLoading, dailyJapaneseRankings, dailyEnglishRankings,
  japaneseRankings, englishRankings,
  getRankingByLimitParam, getDailyRankingByLimitParam
} = useRanking();

const rankingDataLimit: number = 5;
const dailyRankingDataLimit: number = 1;
const isTouchpad = ref<boolean>(false);

onMounted(async () => {
  await getDailyRankingByLimitParam(dailyRankingDataLimit);
  await getRankingByLimitParam(rankingDataLimit);

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    isTouchpad.value = true;
  }

  useHead({
    title: "ランキング | Saltype"
  })
});
</script>

<template>
  <CursorEffect v-if="!isTouchpad" />
  <ScrollHandler />
  <PageIndicator :total-pages=3 />
  <div class="page">
    <RankingHeader title="ランキング" />
    <DailyRankingCard :daily-japanese-rankings-by-combination="dailyJapaneseRankings"
      :daily-english-rankings-by-combination="dailyEnglishRankings" :daily-ranking-data-limit="dailyRankingDataLimit" />
  </div>
  <div class="page">
    <RankingHeader title="日本語" />
    <JapaneseRankingCard :rankings-by-combination="japaneseRankings" :ranking-data-limit="rankingDataLimit" />
  </div>
  <div class="page">
    <RankingHeader title="英語" />
    <EnglishRankingCard :rankings-by-combination="englishRankings" :ranking-data-limit="rankingDataLimit" />
  </div>
  <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
