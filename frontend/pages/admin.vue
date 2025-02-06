<script setup lang="ts">
import UserAdminHeader from '~/components/organisms/admin/UserAdminHeader.vue';
import UserAdminCard from '~/components/organisms/admin/UserAdminCard.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { useUser } from '~/composables/common/useUser';

const { checkAdminPermission, isAdmin, isLoading } = useUser();
const checkCompleted = ref(false);

watchEffect(async () => {
    if (checkCompleted.value && !isAdmin.value) {
        await navigateTo('/home');
    }
});

onMounted(async () => {
    useHead({
        title: "ユーザ管理 | Saltype"
    });

    await checkAdminPermission();
    checkCompleted.value = true;
});
</script>

<template>
    <div class="page">
        <UserAdminHeader />
        <UserAdminCard />
    </div>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>