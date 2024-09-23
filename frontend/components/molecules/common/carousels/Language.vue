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
    <BaseCarousel :slides="2" :options="{ loop: true }" @slide-change="handleSlideChange">
        <template #slide-0>
            <Text color="white" size="large" text="日本語" />
        </template>
        <template #slide-1>
            <Text color="white" size="large" text="英語" />
        </template>
    </BaseCarousel>
</template>