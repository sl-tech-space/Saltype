<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import HomeHeader from '~/components/organisms/home/HomeHeader.vue';
import HomeCard from '~/components/organisms/home/HomeCard.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

onMounted(() => {
  useHead({
    title: "ホーム | Saltype"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <HomeHeader />
    <HomeCard />
  </div>
  <CopyRight />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
