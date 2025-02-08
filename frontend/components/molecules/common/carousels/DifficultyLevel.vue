<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';

const props = defineProps<{
  modelValue: number
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

// ローカルストレージのキー
const STORAGE_KEY = 'difficultyLevelOnCarousel';

// 初期値の設定（ローカルストレージの値を優先）
const currentSlide = ref(
  Number(localStorage.getItem(STORAGE_KEY)) ?? props.modelValue
);

// コンポーネントマウント時に初期値を設定
onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, currentSlide.value.toString());
  }
});

const handleSlideChange = (index: number) => {
  currentSlide.value = index;
  localStorage.setItem(STORAGE_KEY, index.toString());
  emit('update:modelValue', index);
};

watch(() => props.modelValue, (newValue) => {
  if (newValue !== currentSlide.value) {
    currentSlide.value = newValue;
    localStorage.setItem(STORAGE_KEY, newValue.toString());
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