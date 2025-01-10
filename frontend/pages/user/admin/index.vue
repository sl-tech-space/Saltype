<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import UserAdminHeader from '~/components/organisms/user/admin/UserAdminHeader.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';
import UserAdminCard from '~/components/organisms/user/admin/UserAdminCard.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { useUser } from '~/composables/user/useUser';

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
        <CursorEffect />
        <UserAdminHeader />
        <UserAdminCard />
    </div>
    <CopyRight />
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
.page {
    @extend %full-page;
}
</style>