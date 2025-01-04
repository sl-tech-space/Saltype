<script setup lang="ts">
import Input from '~/components/atoms/inputs/Input.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Select from '~/components/atoms/selects/Select.vue';
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
const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedRank = ref('all');

const rankOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'メンバー', label: 'メンバー' },
    { value: '主任', label: '主任' },
    { value: '係長', label: '係長' },
    { value: '課長', label: '課長' },
    { value: '部長', label: '部長' },
    { value: '取締役', label: '取締役' },
    { value: '社長', label: '社長' },
];

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
    let result = userArray.value;
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(user =>
            user.userName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }
    if (selectedRank.value !== 'all') {
        result = result.filter(user => user.userRank === selectedRank.value);
    }
    result = [...result].sort((a, b) => {
        if (sortOrder.value === 'asc') {
            return Number(a.todaysMaxScore) - Number(b.todaysMaxScore);
        } else {
            return Number(b.todaysMaxScore) - Number(a.todaysMaxScore);
        }
    });
    return result;
});

const toggleSort = () => {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
};
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
                :is-rounded="true" width="large" class="search-input" />
        </div>
        <Button width="large" border="sub-color" background="black" :is-rounded="true"
            :button-text="sortOrder === 'desc' ? `スコア&nbsp;:&nbsp;降順&nbsp;&#9660;` : `スコア&nbsp;:&nbsp;昇順&nbsp;&#9650;`"
            @click="toggleSort" />
        <Select v-model="selectedRank" :options="rankOptions" width="large" border="main-color" :is-rounded="true"
            select-text="ランク&nbsp:&nbsp" />
    </div>
    <PaginatedUserList :items="filteredUsers" :items-per-page="itemsPerPage" @user-updated="refreshAllUserInfo" />
</template>

<style lang="scss" scoped>
.search-container {
    position: relative;
    width: 100%;
    margin-bottom: 1%;
    display: flex;
    align-items: center;
    gap: 5px;
}

.input-wrapper {
    position: relative;
    display: inline-block;
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