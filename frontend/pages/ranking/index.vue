<script setup lang="ts">
import ScrollHandler from "~/components/molecules/common/ui/ScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import DailyRankingCard from "~/components/organisms/ranking/DailyRankingCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import PageIndicator from "~/components/molecules/common/ui/PageIndicator.vue";
import { useRanking } from '~/composables/ranking/useRanking';
import { useErrorNotification } from "~/composables/common/useError";

const rankingTitle = "ランキング<br>";
const rankingDataLimit: number = 5;
const dailyRankingDataLimit: number = 1;
const isTouchDevice = ref<boolean>(false);
const isMultiTouch = ref<boolean>(false);

const handleTouchStart = (event: TouchEvent) => {
  isMultiTouch.value = event.touches.length >= 2;
};

const handleTouchEnd = () => {
  isMultiTouch.value = false;
};

const {
  isLoading, error,
  dailyJapaneseRankings, dailyEnglishRankings,
  japaneseRankings, englishRankings,
  getRankingByLimitParam, getDailyRankingByLimitParam
} = useRanking();

const { showErrorNotification } = useErrorNotification(error);

onMounted(async () => {
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  await Promise.all([
    getDailyRankingByLimitParam(dailyRankingDataLimit),
    getRankingByLimitParam(rankingDataLimit)
  ]);

  const checkTouchDevice = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer:coarse)').matches
    );
  };

  isTouchDevice.value = checkTouchDevice();

  useHead({
    title: "ランキング | Saltype"
  })
});

onUnmounted(() => {
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
});
</script>

<template>
  <ScrollHandler v-if="!isTouchDevice && !isMultiTouch" />
  <PageIndicator :total-pages=3 />
  <div class="page">
    <RankingHeader :title="rankingTitle + '本日のチャンピオン'" />
    <DailyRankingCard :daily-japanese-rankings-by-combination="dailyJapaneseRankings"
      :daily-english-rankings-by-combination="dailyEnglishRankings" :daily-ranking-data-limit="dailyRankingDataLimit" />
    <RankingHeader :title="rankingTitle + '日本語'" />
    <JapaneseRankingCard :rankings-by-combination="japaneseRankings" :ranking-data-limit="rankingDataLimit" />
    <RankingHeader :title="rankingTitle + '英語'" />
    <EnglishRankingCard :rankings-by-combination="englishRankings" :ranking-data-limit="rankingDataLimit" />
  </div>
  <Loading :is-loading="isLoading" />
  <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
