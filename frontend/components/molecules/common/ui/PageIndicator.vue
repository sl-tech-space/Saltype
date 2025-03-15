<script setup lang="ts">
/**
 * 現在のページの位置をバーで表示
 */
interface Props {
    totalPages?: number;
}

const props = withDefaults(defineProps<Props>(), {
    totalPages: 1
});

const currentPage = ref(0);

// 現在位置の更新
const updateCurrentPage = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    currentPage.value = Math.round(scrollPosition / windowHeight);
};

// インジケータをクリックでスクロール
const scrollToPage = (pageIndex: number) => {
    window.scrollTo({
        top: pageIndex * window.innerHeight,
        behavior: 'smooth'
    });
};

onMounted(() => {
    window.addEventListener('scroll', updateCurrentPage);
    updateCurrentPage();
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateCurrentPage);
});
</script>

<template>
    <div class="page-indicator">
        <div v-for="i in props.totalPages" :key="i" :class="['indicator', { active: currentPage === i - 1 }]"
            @click="scrollToPage(i - 1)">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-indicator {
    position: fixed;
    right: 0.5%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;

    .indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: $white;
        cursor: pointer;
        transition: all 0.3s ease;

        &.active {
            background-color: $main-color;
            transform: scale(1.3);
        }
    }
}

// スクロールスナップを有効にする
html,
body {
    scroll-snap-type: y mandatory;
}
</style>