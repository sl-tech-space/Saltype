<script setup lang="ts">
import CursorEffect from '~/composables/ui/CursorEffect.vue';
import HomeHeader from '~/components/organisms/home/HomeHeader.vue';
import HomeCard from '~/components/organisms/home/HomeCard.vue';

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
    <HomeCard />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
