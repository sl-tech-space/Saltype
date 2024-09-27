<script setup lang="ts">
import CursorEffect from '~/composables/ui/CursorEffect.vue';
import TypingHeader from '~/components/organisms/typing/TypingHeader.vue';
import TypingScreen from '~/components/organisms/typing/TypingScreen.vue';

onMounted(() => {
  useHead({
    title: "タイピング"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <TypingHeader />
    <TypingScreen />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>