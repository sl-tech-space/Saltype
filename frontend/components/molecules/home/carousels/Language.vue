<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';
</script>

<template>
    <BaseCarousel :slides="2" :options="{ loop: true }">
        <template #slide-0>
            <Text color="white" size="large" text="日本語" />
        </template>
        <template #slide-1>
            <Text color="white" size="large" text="英語" />
        </template>
    </BaseCarousel>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/select-carousels.scss" />