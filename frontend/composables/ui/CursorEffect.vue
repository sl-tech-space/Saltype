<script setup lang="ts">
/**
 * 追従型カーソルエフェクト
 */
const cursor = ref(null);

const updateCursor = (event: any) => {
  if (cursor.value) {
    (cursor.value as HTMLElement).style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  }
}

onMounted(() => {
  window.addEventListener("mousemove", updateCursor);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
});
</script>

<template>
  <div ref="cursor" class="cursor">
    <slot />
  </div>
</template>

<style lang="scss" src="@/assets/styles/composables/cursor-effect.scss" />
