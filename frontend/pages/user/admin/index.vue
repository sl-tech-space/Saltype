<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';

onMounted(() => {
    useHead({
        title: "ユーザ管理 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <CursorEffect />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>