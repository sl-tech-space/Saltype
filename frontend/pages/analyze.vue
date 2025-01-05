<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import AnalyzeHeader from '~/components/organisms/analyze/AnalyzeHeader.vue';
import AnalyzeCard from '~/components/organisms/analyze/AnalyzeCard.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

onMounted(() => {
  useHead({
    title: "分析情報 | Saltype"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <AnalyzeHeader />
    <AnalyzeCard />
  </div>
  <CopyRight />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>