<script setup lang="ts">
import UserSettingHeader from '~/components/organisms/user/setting/UserSettingHeader.vue';
import UserSettingCard from '~/components/organisms/user/setting/UserSettingCard.vue';

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