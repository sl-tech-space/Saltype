<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import TypingHeader from '~/components/organisms/typing/TypingHeader.vue';
import TypingScreen from '~/components/organisms/typing/TypingScreen.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

onMounted(() => {
    useHead({
        title: "タイピング | Saltype"
    })
})
</script>

<template>
    <CursorEffect />
    <div class="page">
        <TypingHeader />
        <TypingScreen />
    </div>
    <CopyRight />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
    @include hidden;
}
</style>