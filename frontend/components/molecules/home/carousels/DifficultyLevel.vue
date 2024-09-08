<script setup lang="ts">
import BaseCarousel from '../../common/BaseCarousel.vue';
import Text from '~/components/atoms/texts/Text.vue';
</script>

<template>
    <BaseCarousel :slides="3" :options="{ loop: true }">
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

<style lang="scss" src="@/assets/styles/components/molecules/select-carousels.scss" />