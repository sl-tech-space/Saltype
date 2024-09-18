<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';

const currentSlide = ref(0);

const handleSlideChange = (index: number) => {
    currentSlide.value = index;
};
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