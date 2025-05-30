<script setup lang="ts">
interface Key {
  label: string;
  code: string;
  wide?: boolean;
  extraWide?: boolean;
}

const keyboardLayout: Key[][] = [
  [
    { label: 'Esc', code: 'Escape' },
    { label: 'F1', code: 'F1' }, { label: 'F2', code: 'F2' }, { label: 'F3', code: 'F3' }, { label: 'F4', code: 'F4' },
    { label: 'F5', code: 'F5' }, { label: 'F6', code: 'F6' }, { label: 'F7', code: 'F7' }, { label: 'F8', code: 'F8' },
    { label: 'F9', code: 'F9' }, { label: 'F10', code: 'F10' }, { label: 'F11', code: 'F11' }, { label: 'F12', code: 'F12' },
    { label: 'PrtSc', code: 'PrintScreen' }, { label: 'ScrLk', code: 'ScrollLock' }, { label: 'Pause', code: 'Pause' }
  ],
  [
    { label: '半角/全角', code: 'Zenkaku' }, { label: '1', code: 'Digit1' }, { label: '2', code: 'Digit2' }, { label: '3', code: 'Digit3' }, { label: '4', code: 'Digit4' },
    { label: '5', code: 'Digit5' }, { label: '6', code: 'Digit6' }, { label: '7', code: 'Digit7' }, { label: '8', code: 'Digit8' }, { label: '9', code: 'Digit9' },
    { label: '0', code: 'Digit0' }, { label: '-', code: 'Minus' }, { label: '^', code: 'Equal' }, { label: '¥', code: 'IntlYen' }, { label: 'Backspace', code: 'Backspace', wide: true }
  ],
  [
    { label: 'Tab', code: 'Tab', wide: true }, { label: 'Q', code: 'KeyQ' }, { label: 'W', code: 'KeyW' }, { label: 'E', code: 'KeyE' }, { label: 'R', code: 'KeyR' },
    { label: 'T', code: 'KeyT' }, { label: 'Y', code: 'KeyY' }, { label: 'U', code: 'KeyU' }, { label: 'I', code: 'KeyI' }, { label: 'O', code: 'KeyO' },
    { label: 'P', code: 'KeyP' }, { label: '@', code: 'BracketLeft' }, { label: '[', code: 'BracketRight' }, { label: 'Enter', code: 'Enter', wide: true }
  ],
  [
    { label: 'CapsLock', code: 'CapsLock', wide: true }, { label: 'A', code: 'KeyA' }, { label: 'S', code: 'KeyS' }, { label: 'D', code: 'KeyD' }, { label: 'F', code: 'KeyF' },
    { label: 'G', code: 'KeyG' }, { label: 'H', code: 'KeyH' }, { label: 'J', code: 'KeyJ' }, { label: 'K', code: 'KeyK' }, { label: 'L', code: 'KeyL' },
    { label: ';', code: 'Semicolon' }, { label: ':', code: 'Quote' }, { label: ']', code: 'Backslash' }
  ],
  [
    { label: 'Shift', code: 'ShiftLeft', wide: true }, { label: 'Z', code: 'KeyZ' }, { label: 'X', code: 'KeyX' }, { label: 'C', code: 'KeyC' }, { label: 'V', code: 'KeyV' },
    { label: 'B', code: 'KeyB' }, { label: 'N', code: 'KeyN' }, { label: 'M', code: 'KeyM' }, { label: ',', code: 'Comma' }, { label: '.', code: 'Period' },
    { label: '/', code: 'Slash' }, { label: '\\', code: 'IntlRo' }, { label: 'Shift', code: 'ShiftRight', wide: true }
  ],
  [
    { label: 'Ctrl', code: 'ControlLeft' }, { label: 'Win', code: 'MetaLeft' }, { label: 'Alt', code: 'AltLeft' },
    { label: '無変換', code: 'Convert' }, { label: 'Space', code: 'Space', extraWide: true }, { label: '変換', code: 'NonConvert' },
    { label: 'かな', code: 'KanaMode' }, { label: 'Alt', code: 'AltRight' }, { label: 'Win', code: 'MetaRight' }, { label: 'Menu', code: 'ContextMenu' }, { label: 'Ctrl', code: 'ControlRight' }
  ]
];

const correctKeys = ref<string[]>([]);
const incorrectKeys = ref<string[]>([]);
const { $bus } = useNuxtApp();

type KeyPressEvent = KeyboardEvent & { result: "correct" | "incorrect" };

onMounted(() => {
  $bus.$on('key-press', ((event: KeyPressEvent) => {
    const keyCode = event.code;
    if (event.result === 'correct') {
      correctKeys.value = [...correctKeys.value, keyCode];
      setTimeout(() => {
        correctKeys.value = correctKeys.value.filter(code => code !== keyCode);
      }, 200);
    } else if (event.result === 'incorrect') {
      incorrectKeys.value = [...incorrectKeys.value, keyCode];
      setTimeout(() => {
        incorrectKeys.value = incorrectKeys.value.filter(code => code !== keyCode);
      }, 200);
    }
  }) as (event: unknown) => void);
});

onUnmounted(() => {
  $bus.$off('key-press');
});

// 拡大率を監視するref
const zoomLevel = ref(1);

// 拡大率の監視と更新
onMounted(() => {
  const updateZoom = () => {
    zoomLevel.value = window.devicePixelRatio || 1;
  };
  
  updateZoom();
  
  window.addEventListener('resize', updateZoom);
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateZoom);
  });
});

// キーのサイズを計算するcomputed
const keySize = computed(() => {
  const baseSize = 30;
  return Math.max(baseSize / zoomLevel.value, 20);
});

const wideKeyWidth = computed(() => keySize.value * 2);
const extraWideKeyWidth = computed(() => keySize.value * 6.67);
const fontSize = computed(() => Math.max(10 / zoomLevel.value, 7)); // 最小フォントサイズを7pxに制限
</script>

<template>
  <div class="keyboard-layout">
    <div class="keyboard">
      <div v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex" class="keyboard-row">
        <div v-for="key in row" :key="key.code" 
             class="key" 
             :class="{
               'key-wide': key.wide,
               'key-extra-wide': key.extraWide,
               'key-correct': correctKeys.includes(key.code),
               'key-incorrect': incorrectKeys.includes(key.code)
             }"
             :style="{
               width: `${key.extraWide ? extraWideKeyWidth : (key.wide ? wideKeyWidth : keySize)}px`,
               height: `${keySize}px`,
               fontSize: `${fontSize}px`
             }">
          {{ key.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard-layout {
  @include horizontal-centered-flex;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .keyboard {
    border: 1px solid $sub-color;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px $translucent-black;
    width: 100%;
    max-width: 1000px;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    margin: 2px 0;
  }

  .key {
    border: 1px solid $sub-color;
    border-radius: 3px;
    margin: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;

    &.key-correct {
      color: $correct-color;
      border-color: $correct-color;
    }

    &.key-incorrect {
      color: $incorrect-color;
      border-color: $incorrect-color;
    }
  }
}

@media (max-width: 1200px) {
  .keyboard-layout {
    transform: scale(0.7);
    transform-origin: top center;
  }
}

@media (max-width: 992px) {
  .keyboard-layout {
    transform: scale(0.6);
  }
}

@media (max-width: 768px) {
  .keyboard-layout {
    transform: scale(0.5);
  }
}

@media (max-width: 576px) {
  .keyboard-layout {
    transform: scale(0.4);
    padding: 10px;
  }
}
</style>