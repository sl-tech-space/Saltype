<script setup lang="ts">
import HomeHeader from '~/components/organisms/home/HomeHeader.vue';
import HomeCard from '~/components/organisms/home/HomeCard.vue';

onMounted(() => {
  useHead({
    title: "ホーム | Saltype"
  })
})
</script>

<template>
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
