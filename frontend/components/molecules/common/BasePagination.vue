<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits(['page-change']);

const visiblePages = computed(() => {
    const delta = 1; // 現在のページの前後に表示するページ数
    const range: (number | string)[] = [];
    const total = props.totalPages;
    const current = props.currentPage;

    if (total <= 2) {
        for (let i = 1; i <= total; i++) {
            range.push(i);
        }
    } else {
        range.push(1);

        if (current > 3) {
            range.push('...');
        }

        // 現在のページの前後のページ
        const start = Math.max(2, current - delta);
        const end = Math.min(total - 1, current + delta);
        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        if (current < total - 2) {
            range.push('...');
        }

        range.push(total);
    }

    return range;
});

const goToPreviousPage = () => {
    if (props.currentPage > 1) {
        emit('page-change', props.currentPage - 1);
    }
};

const goToNextPage = () => {
    if (props.currentPage < props.totalPages) {
        emit('page-change', props.currentPage + 1);
    }
};

const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
        emit('page-change', page);
    }
};
</script>

<template>
    <div class="pagination">
        <Button button-text="<" :is-rounded="true" border="main-color" :disabled="currentPage === 1"
            @click="goToPreviousPage" />
        <Button v-for="page in visiblePages" :key="page" :button-text="page.toString()"
            :is-active="page === currentPage" :is-rounded="true" border="main-color" :disabled="page === '...'"
            @click="handlePageClick(page)" />
        <Button button-text=">" :is-rounded="true" border="main-color" :disabled="currentPage === totalPages"
            @click="goToNextPage" />
    </div>
</template>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
}
</style>
