<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";

onMounted(() => {
  useHead({
    title: "ランキング"
  })
})
</script>

<template>
    <CursorEffect />
    <div class="page">
        <RankingHeader />
    </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
