<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLocalStorage } from '~/composables/common/useLocalStorage';

const props = defineProps<{
  modelValue: number
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

// ローカルストレージのキー
const STORAGE_KEY = 'difficultyLevelOnCarousel';

// useLocalStorageを使用して状態管理
const { value: storedValue, setValue } = useLocalStorage(STORAGE_KEY, props.modelValue.toString());

// 数値型に変換して保持
const currentSlide = computed(() => 
  Number(storedValue.value ?? props.modelValue)
);

const handleSlideChange = (index: number) => {
  setValue(index.toString());
  emit('update:modelValue', index);
};

watch(() => props.modelValue, (newValue) => {
  if (newValue !== Number(storedValue.value)) {
    setValue(newValue.toString());
  }
});
</script>

<template>
  <BaseCarousel :slides="3" :options="{ loop: true, startIndex: currentSlide }" @slide-change="handleSlideChange">
    <template #slide-0>
      <Text color="white" size="large" text="イージー" />
    </template>
    <template #slide-1>
      <Text color="white" size="large" text="ノーマル" />
    </template>
    <template #slide-2>
      <Text color="white" size="large" text="ハード" />
    </template>
  </BaseCarousel>
</template>