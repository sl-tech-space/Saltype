<script setup lang="ts">
import BaseHeader from '~/components/molecules/common/BaseHeader.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Timer from '~/components/molecules/typing/Timer.vue';
</script>

<template>
    <BaseHeader>
        <template #header-left>
            <Title size="small" color="white" text="タイピング" />
        </template>
        <template #header-center>
            <Timer />
        </template>
    </BaseHeader>
</template>