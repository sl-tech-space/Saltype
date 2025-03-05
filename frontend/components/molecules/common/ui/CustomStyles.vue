<script setup lang="ts">
import { useColorStore } from '~/store/colorStore'

const { colorStore } = useColorStore()

// ライトモードかどうかを判定
const isLightMode = computed(() =>
  colorStore.value.backgroundColor === '#dcdcdc' &&
  colorStore.value.textColor === '#000000'
);

// ボーダーの太さを動的に設定
const borderWidth = computed(() =>
  isLightMode.value ? '2px' : '1px'
);

// フォントの太さを動的に設定
const fontWeight = computed(() =>
  isLightMode.value ? '550' : '400'
);

useHead({
  style: [{
    children: computed(() => `
      :root {
        --text-color: ${colorStore.value.textColor};
        --background-color: ${colorStore.value.backgroundColor};
        --main-color: ${colorStore.value.mainColor};
        --sub-color: ${colorStore.value.subColor};
        --hover-color: ${colorStore.value.hoverColor};
        --border-width: ${borderWidth.value};
        --font-weight: ${fontWeight.value};
      }

      body {
        color: var(--text-color);
        background-color: var(--background-color);
        font-weight: var(--font-weight);
      }

      /* カードのボーダー設定 */
      .card {
        border: var(--border-width) solid var(--main-color) !important;
      }

      /* セパレーターのボーダー設定 */
      .separator {
        border-width: var(--border-width) !important;
      }

      /* その他のボーダーを持つ要素 */
      .base-input,
      .base-button,
      .base-carousel {
        border-width: var(--border-width) !important;
      }

      /* テキスト要素の太さ設定 */
      .text,
      .title,
      .label,
      button {
        font-weight: var(--font-weight) !important;
      }
    `)
  }]
})
</script>

<template>
  <ClientOnly />
</template>