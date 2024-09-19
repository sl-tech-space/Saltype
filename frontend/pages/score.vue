<script setup lang="ts">
import ScorePage from '~/components/organisms/ScorePage.vue';

useHead({
  title: "スコア"
});
</script>

<template>
  <div class="score-page">
    <ScorePage />
  </div>
</template>

<style lang="scss" src="@/assets/styles/pages/score.scss" />
