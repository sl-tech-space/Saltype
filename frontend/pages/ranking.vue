<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";

onMounted(() => {
  useHead({
    title: "ランキング"
  })
})
</script>

<template>
    <CursorEffect />
    <div class="page">
        
    </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
