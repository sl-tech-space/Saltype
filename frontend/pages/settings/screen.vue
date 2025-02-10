<script setup lang="ts">
import ScreenSettingCard from '~/components/organisms/settings/screen/ScreenSettingCard.vue';
import ScreenSettingHeader from '~/components/organisms/settings/screen/ScreenSettingHeader.vue';

onMounted(() => {
    useHead({
        title: "画面設定 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <ScreenSettingHeader />
        <ScreenSettingCard />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>