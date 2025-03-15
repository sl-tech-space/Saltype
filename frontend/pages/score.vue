<script setup lang="ts">
import ScoreHeader from '~/components/organisms/score/ScoreHeader.vue';
import ScoreBoardCard from '~/components/organisms/score/ScoreBoardCard.vue';

onMounted(() => {
  useHead({
    title: "スコア | Saltype"
  })
})
</script>

<template>
  <div class="page">
    <ScoreHeader />
    <ScoreBoardCard />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
