<script setup lang="ts">
import RankingPage from '~/components/organisms/RankingPage.vue';

useHead({
  title: "ランキング"
});
</script>

<template>
  <div class="ranking-page">
    <RankingPage />
  </div>
</template>

<style lang="scss" src="@/assets/styles/pages/ranking.scss" />
