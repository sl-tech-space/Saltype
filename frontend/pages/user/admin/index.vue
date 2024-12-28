<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import UserAdminHeader from '~/components/organisms/user/admin/UserAdminHeader.vue';
import PaginatedUserList from '~/components/molecules/user/admin/PaginatedUserList.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';
import UserAdminCard from '~/components/organisms/user/admin/UserAdminCard.vue';

onMounted(() => {
    useHead({
        title: "ユーザ管理 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <CursorEffect />
        <UserAdminHeader />
        <UserAdminCard />
    </div>
    <CopyRight />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>