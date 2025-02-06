<script setup lang="ts">
import UserSettingHeader from '~/components/organisms/settings/user/UserSettingHeader.vue';
import UserSettingCard from '~/components/organisms/settings/user/UserSettingCard.vue';

onMounted(() => {
    useHead({
        title: "ユーザ設定 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <UserSettingHeader />
        <UserSettingCard />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>