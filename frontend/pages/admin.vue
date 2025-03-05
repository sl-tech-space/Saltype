<script setup lang="ts">
import UserAdminHeader from '~/components/organisms/admin/UserAdminHeader.vue';
import UserAdminCard from '~/components/organisms/admin/UserAdminCard.vue';

onMounted(async () => {
    useHead({
        title: "ユーザ管理 | Saltype"
    });
});
</script>

<template>
    <div class="page">
        <UserAdminHeader />
        <UserAdminCard />
    </div>
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>