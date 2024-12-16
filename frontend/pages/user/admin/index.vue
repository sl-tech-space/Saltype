<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import UserAdminHeader from '~/components/organisms/user/admin/UserAdminHeader.vue';
import PaginatedUserList from '~/components/organisms/user/admin/PaginatedUserList.vue';

const items = ref([
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 2, title: '項目2' },
    { id: 1, title: '項目1' },
    { id: 10, title: '項目3' },

])

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
        <PaginatedUserList :items="items" :items-per-page="10" />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>