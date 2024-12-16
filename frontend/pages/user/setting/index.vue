<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import UserSettingHeader from '~/components/organisms/user/setting/UserSettingHeader.vue';
import UserSettingCard from '~/components/organisms/user/setting/UserSettingCard.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

onMounted(() => {
    useHead({
        title: "ユーザ設定 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <CursorEffect />
        <UserSettingHeader />
        <UserSettingCard />
    </div>
    <CopyRight />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>