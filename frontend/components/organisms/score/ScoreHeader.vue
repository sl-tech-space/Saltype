<script setup lang="ts">
import BaseHeader from '~/components/molecules/common/BaseHeader.vue';
import Title from '~/components/atoms/texts/Title.vue';
</script>

<template>
    <BaseHeader title="タイピング結果">
        <template #header-left>
            <Title size="small" color="white" text="スコアボード" />
        </template>
    </BaseHeader>
</template>