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

<style lang="scss" src="@/assets/styles/composables/loading.scss" />