<script setup lang="ts">
import BasePagination from '~/components/molecules/common/BasePagination.vue';
import Text from '~/components/atoms/texts/Text.vue';

const props = defineProps<{
    items: Array<{ id: number; title: string }>;
    itemsPerPage: number;
}>();

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

const currentItems = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.items.slice(start, end);
});

const changePage = (page: number) => {
    currentPage.value = page;

    window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
    <div>
        <ul>
            <li v-for="item in currentItems" :key="item.id">
                <Text size="large">{{ item.title }}</Text>
            </li>
        </ul>
        <BasePagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
    </div>
</template>
