<script setup lang="ts">
/**
 * ローディング画面
 */
defineProps<{
    isLoading: boolean
}>()
</script>

<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>
</template>

<style lang="scss" scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-spinner {
    width: 60px;
    height: 60px;
    border: 8px solid $sub-color;
    border-top: 8px solid $main-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>