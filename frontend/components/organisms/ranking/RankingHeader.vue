<script setup lang="ts">
import BaseHeader from '~/components/molecules/common/BaseHeader.vue';

interface Props {
    title: string,
    backName?: string
}

const props = defineProps<Props>();
</script>

<template>
    <BaseHeader :title="props.title" :onBackClick="props.backName" />
</template>