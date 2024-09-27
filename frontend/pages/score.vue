<script setup lang="ts">
import CursorEffect from '~/composables/ui/CursorEffect.vue';
import ScoreHeader from '~/components/organisms/score/ScoreHeader.vue';
import ScoreBoardCard from '~/components/organisms/score/ScoreBoardCard.vue';

onMounted(() => {
  useHead({
    title: "スコア"
  })
})
</script>

<template>
  <CursorEffect />
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
