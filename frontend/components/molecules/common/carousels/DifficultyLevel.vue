<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';

const props = defineProps<{
  modelValue: number
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

const currentSlide = ref(props.modelValue);

const handleSlideChange = (index: number) => {
    currentSlide.value = index;
    emit('update:modelValue', index);
};

watch(() => props.modelValue, (newValue) => {
  if (newValue !== currentSlide.value) {
    currentSlide.value = newValue;
  }
});
</script>

<template>
    <BaseCarousel :slides="3" :options="{ loop: true }" @slide-change="handleSlideChange">
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