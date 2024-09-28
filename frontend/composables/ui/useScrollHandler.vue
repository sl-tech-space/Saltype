<script setup lang="ts">
const handleScroll = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    // 下スクロール
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  } else {
    // 上スクロール
    window.scrollBy({
      top: -window.innerHeight,
      behavior: "smooth",
    });
  }
  addScrollListener(); // スクロール後にリスナーを再度追加
};
const addScrollListener = () => {
  window.addEventListener("wheel", handleScroll, {
    once: true,
  });
};
const removeScrollListener = () => {
  window.removeEventListener("wheel", handleScroll);
};
onMounted(() => {
  document.body.style.overflow = "hidden"; // bodyのスクロールを禁止
  addScrollListener();
});
onUnmounted(() => {
  document.body.style.overflow = ""; // bodyのスクロールを元に戻す
  removeScrollListener();
});
</script>

<template>
  <div class="content">
    <slot />
  </div>
</template>