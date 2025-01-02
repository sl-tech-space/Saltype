<script setup lang="ts">
import { useAdmin } from '~/composables/user/admin/useAdmin';
import type { UserList } from '~/types/user';
import type { ApiUserList } from '~/types/user';
import PaginatedUserList from '~/components/molecules/user/admin/PaginatedUserList.vue';

const { getAllUserInfo, userItems } = useAdmin();
const userArray = ref<UserList[]>([]);

const refreshAllUserInfo = async () => {
    await getAllUserInfo();
};

onMounted(async () => {
    await refreshAllUserInfo();
});

watch(userItems, () => {
    userArray.value = (userItems.value as ApiUserList[]).map(convertToUserList);
}, { immediate: true });
</script>

<template>
    <PaginatedUserList :items="userArray" :items-per-page="2" @user-updated="refreshAllUserInfo" />
</template>

<style lang="scss" scoped></style>
