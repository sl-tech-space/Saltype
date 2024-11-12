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

<style lang="scss" scoped>
.cursor {
  width: 30px;
  height: 30px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 0 0 30px $main-color, 0 0 45px $main-color, 0 0 80px $main-color;
  pointer-events: none;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  transform: translate(-50%, -50%);
  mix-blend-mode: exclusion;
  z-index: 2000;
}
</style>
