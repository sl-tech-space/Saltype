<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits(['page-change']);

const visiblePages = computed(() => {
    const delta = 2;
    const range: (number | string)[] = [];
    const total = props.totalPages;
    const current = props.currentPage;

    if (total <= 1) return [1];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }

    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);

    return range;
});
</script>

<template>
    <div class="pagination">
        <Button v-for="page in visiblePages" :key="page" :button-text="page.toString()" :isActive="page === currentPage"
            :disabled="page === '...'" @click="page !== '...' && $emit('page-change', page)" :is-rounded="true"
            border="main-color" />
    </div>
</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
}
</style>
