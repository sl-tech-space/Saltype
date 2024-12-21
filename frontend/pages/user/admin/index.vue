<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import UserAdminHeader from '~/components/organisms/user/admin/UserAdminHeader.vue';
import PaginatedUserList from '~/components/molecules/user/admin/PaginatedUserList.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

const items = ref([
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },
    {
        userId: "eFX43-tuYWjB69h9@zY", userName: 'テストユーザ',
        email: 'testuser@example.com',
        todaysMaxScore: '9999',
        userRank: 'メンバー',
    },

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
        <PaginatedUserList :items="items" :items-per-page="7" />
    </div>
    <CopyRight />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>