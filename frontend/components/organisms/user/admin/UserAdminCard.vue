<script setup lang="ts">
import Input from '~/components/atoms/inputs/Input.vue';
import PaginatedUserList from '~/components/molecules/user/admin/PaginatedUserList.vue';
import { useAdmin } from '~/composables/user/admin/useAdmin';
import type { UserList } from '~/types/user';
import type { ApiUserList } from '~/types/user';
import { useColorStore } from '~/store/colorStore';

const { getAllUserInfo, userItems } = useAdmin();
const { colorStore } = useColorStore();
const userArray = ref<UserList[]>([]);
const itemsPerPage = 5;
const searchQuery = ref('');

const refreshAllUserInfo = async () => {
    await getAllUserInfo();
};

onMounted(async () => {
    await refreshAllUserInfo();
});

watch(userItems, () => {
    userArray.value = (userItems.value as ApiUserList[]).map(convertToUserList);
}, { immediate: true });

const filteredUsers = computed(() => {
    if (!searchQuery.value) return userArray.value;
    const query = searchQuery.value.toLowerCase();
    return userArray.value.filter(user =>
        user.userName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
});
</script>

<template>
    <div class="search-container">
        <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                :fill="colorStore.mainColor" class="search-icon">
                <path
                    d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
            <Input v-model="searchQuery" type="text" placeholder="ユーザ名またはメールアドレスで検索" border="main-color"
                :is-rounded="true" width="large" height="small" class="search-input" />
        </div>
    </div>
    <PaginatedUserList :items="filteredUsers" :items-per-page="itemsPerPage" @user-updated="refreshAllUserInfo" />
</template>

<style lang="scss" scoped>
.search-container {
    position: relative;
    width: 100%;
    margin-bottom: 1%;
}

.input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    margin-left: 5%;
}

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
}

.search-input {
    padding-left: 40px;
    font-size: 16px;
}
</style>
