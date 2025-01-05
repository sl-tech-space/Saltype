<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import ScoreHeader from '~/components/organisms/score/ScoreHeader.vue';
import ScoreBoardCard from '~/components/organisms/score/ScoreBoardCard.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

onMounted(() => {
  useHead({
    title: "スコア | Saltype"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <ScoreHeader />
    <ScoreBoardCard />
  </div>
  <CopyRight />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
