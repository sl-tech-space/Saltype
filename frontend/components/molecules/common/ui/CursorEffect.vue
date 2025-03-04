<script setup lang="ts">
import { useColorStore } from '~/store/colorStore';
import { useLocalStorage } from '~/composables/common/useLocalStorage';

const { colorStore } = useColorStore();
const { value: cursorEffectValue, setValue } = useLocalStorage('isFollowCursorEffect', 'true');

const isFollowCursorEffect = ref(cursorEffectValue.value !== 'false');
const cursor = ref(null);
const effectKey = ref(0); // 再マウント用のkey

// ライトモードかどうかを判定
const isLightMode = computed(() =>
  colorStore.value.backgroundColor === '#dcdcdc' &&
  colorStore.value.textColor === '#000000'
);

const updateCursor = (event: any) => {
  if (cursor.value) {
    (cursor.value as HTMLElement).style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  }
}

const updateCursorEffect = (value: boolean) => {
  isFollowCursorEffect.value = value;
  effectKey.value++; // keyを更新して再マウント
  if (value) {
    window.addEventListener("mousemove", updateCursor);
  } else {
    window.removeEventListener("mousemove", updateCursor);
  }
}

// 値の変更を監視
watch(cursorEffectValue, (newValue) => {
  updateCursorEffect(newValue !== 'false');
});

onMounted(() => {
  updateCursorEffect(cursorEffectValue.value !== 'false');
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
});
</script>

<template>
  <div 
    v-if="isFollowCursorEffect" 
    ref="cursor" 
    :key="effectKey"
    class="cursor" 
    :class="{ 'light-mode': isLightMode }"
  >
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

  &.light-mode {
    mix-blend-mode: normal;
    opacity: 0.8;
    box-shadow: 0 0 30px var(--main-color),
      0 0 45px var(--main-color),
      0 0 80px var(--main-color),
      0 0 100px var(--main-color);
  }
}
</style>
