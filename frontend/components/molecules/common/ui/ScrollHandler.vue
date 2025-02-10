<script setup lang="ts">
/**
 * １画面スクロールハンドラー
 */
const isScrolling = ref(false);
const lastScrollTime = ref(0);
const scrollThreshold = 1; // スクロール開始のしきい値
const scrollCooldown = 800; // スクロールのクールダウン時間(ms)

const initScrollHandler = () => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.scrollBehavior = "smooth";
  document.documentElement.style.scrollSnapType = "y mandatory";
  addScrollListener();
};

const cleanupScrollHandler = () => {
  document.body.style.overflow = "";
  document.documentElement.style.scrollBehavior = "";
  document.documentElement.style.scrollSnapType = "";
  removeScrollListener();
};

const handleScroll = (event: WheelEvent) => {
  const currentTime = Date.now();

  // スクロール中やクールダウン中は無視
  if (isScrolling.value || currentTime - lastScrollTime.value < scrollCooldown) {
    event.preventDefault();
    return;
  }

  // 小さなスクロールは無視
  if (Math.abs(event.deltaY) < scrollThreshold) {
    return;
  }

  isScrolling.value = true;
  lastScrollTime.value = currentTime;

  const targetPosition = window.scrollY + (event.deltaY > 0 ? window.innerHeight : -window.innerHeight);

  // スムーズスクロールの実行
  window.scrollTo({
    top: targetPosition,
    behavior: "smooth"
  });

  // スクロールアニメーション完了後の処理
  setTimeout(() => {
    isScrolling.value = false;
    addScrollListener();
  }, scrollCooldown);
};

const addScrollListener = () => {
  window.addEventListener("wheel", handleScroll, {
    once: true,
    passive: false
  });
};

const removeScrollListener = () => {
  window.removeEventListener("wheel", handleScroll);
};

onMounted(() => {
  if (localStorage.getItem('isScrollAssist') === 'true') {
    initScrollHandler();
  } else {
    cleanupScrollHandler();
  }
});

onUnmounted(() => {
  cleanupScrollHandler();
});

// LocalStorageの変更を監視
watch(() => localStorage.getItem('isScrollAssist'), (newValue) => {
  if (newValue === 'true') {
    initScrollHandler();
  } else {
    cleanupScrollHandler();
  }
});
</script>

<template>
  <div class="content">
    <slot />
  </div>
</template>

<style scoped>
.content {
  scroll-behavior: smooth;
}

.content> :deep(*) {
  scroll-snap-align: start;
  height: 100vh;
}
</style>