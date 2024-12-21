<script setup lang="ts">
import BasePagination from '~/components/molecules/common/BasePagination.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

const props = defineProps<{
    items: Array<{
        userId: string;
        userName: string;
        email: string;
        todaysMaxScore: string;
        userRank: string;
    }>;
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
        <ul class="list-container">
            <li v-for="item in currentItems" :key="item.userId" class="list-item">
                <Text size="large" class="item-text">{{ item.userName }}</Text>
                <Text size="large" class="item-text">{{ item.email }}</Text>
                <Text size="large" class="item-text">{{ item.todaysMaxScore }}</Text>
                <Text size="large" class="item-text">{{ item.userRank }}</Text>
                <div class="default-container">
                    <Button type="button" button-text="編集" border="main-color" :is-rounded="true" />
                    <Button type="button" button-text="削除" border="main-color" :is-rounded="true" />
                </div>
            </li>
        </ul>
        <BasePagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
    </div>
</template>

<style lang="scss" scoped>
.list-container {
    width: 100%;
    @include vertical-centered-flex;
    align-items: center;
}

.list-item {
    @include horizontal-centered-flex;
    flex-wrap: nowrap;
    width: 90%;
    min-width: 600px;
    border: 1px solid $main-color;
    border-radius: 8px;
    padding: 5px;
    margin-bottom: 10px;

    .item-text {
        align-self: center;
        margin: 0 5% 0 5%;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .default-container {
        display: flex;
        gap: 10px;
    }
}

@media (max-width: 1268px) {
    .list-item {
        min-width: 1027px;
        padding: 5px;

        .item-text {
            margin: 0 4%; // マージンを縮小
            font-size: 1em; // フォントサイズを少し小さく
        }

        .default-container {
            gap: 5px; // ボタン間の間隔を縮小
        }
    }
}

@media (max-width: 1026px) {
    .list-item {
        min-width: 709px;
        padding: 5px;

        .item-text {
            margin: 0 2%; // マージンを縮小
            font-size: 0.9em; // フォントサイズを少し小さく
        }

        .default-container {
            gap: 5px; // ボタン間の間隔を縮小
        }
    }
}

@media (max-width: 721px) {
    .list-item {
        min-width: 100px;
        padding: 5px;

        .item-text {
            margin: 0 1%; // マージンを縮小
            font-size: 0.7em; // フォントサイズを少し小さく
        }

        .default-container {
            gap: 5px; // ボタン間の間隔を縮小
        }
    }
}
</style>