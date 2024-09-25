<script setup lang="ts">
import CursorEffect from '~/composables/ui/CursorEffect.vue';
import HomeHeader from '~/components/organisms/home/HomeHeader.vue';
import SelectCard from '~/components/molecules/home/SelectCard.vue';

onMounted(() => {
  useHead({
    title: "ホーム"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <HomeHeader />
    <SelectCard />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
