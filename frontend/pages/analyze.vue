<script setup lang="ts">
import AnalyzeHeader from '~/components/organisms/analyze/AnalyzeHeader.vue';
import AnalyzeCard from '~/components/organisms/analyze/AnalyzeCard.vue';

onMounted(() => {
  useHead({
    title: "分析情報 | Saltype"
  })
})
</script>

<template>
  <div class="page">
    <AnalyzeHeader />
    <AnalyzeCard />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>