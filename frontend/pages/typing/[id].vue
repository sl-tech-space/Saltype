<script setup lang="ts">
import TypingHeader from '~/components/organisms/typing/TypingHeader.vue';
import TypingScreen from '~/components/organisms/typing/TypingScreen.vue';

onMounted(() => {
    useHead({
        title: "タイピング | Saltype"
    })
})
</script>

<template>
    <div class="page">
        <TypingHeader />
        <TypingScreen />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
    @include hidden;
}
</style>