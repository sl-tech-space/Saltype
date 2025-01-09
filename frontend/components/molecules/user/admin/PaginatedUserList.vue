<script setup lang="ts">
import BasePagination from '~/components/molecules/common/BasePagination.vue';
import BaseNotification from '../../common/BaseNotification.vue';
import ConfirmModal from './ConfirmModal.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import { useUser } from '~/composables/user/useUser';
import { useAdmin } from '~/composables/user/admin/useAdmin';

const props = defineProps<{
    items: Array<{
        userId: string; // ユーザID
        userName: string; // ユーザ名
        email: string; // メールアドレス
        todaysMaxScore: string; // 本日の最高スコア
        userRank: string; // ユーザランク
    }>;
    itemsPerPage: number; // 1ページあたりの表示数
}>();

const editingItem = ref<string | null>(null);
const editedUserName = ref('');
const editedEmail = ref('');
const message = ref('');
const showNotification = ref(false);
const { updateUserInfo } = useUser();
const { deleteUserInfo } = useAdmin();
const emit = defineEmits(['user-updated']);

const showConfirmModal = ref(false);
const editCooldown = ref(false);
const deleteItem = ref<string | null>(null);
const deleteItemName = ref<string | null>(null);

const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

// 現在のページで表示する情報　ページ切り替えごとに計算
const currentItems = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.items.slice(start, end);
});

const changePage = (page: number) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const startEditing = (item: { userId: string; userName: string; email: string }) => {
    editCooldown.value = true;
    editingItem.value = item.userId;
    editedUserName.value = item.userName;
    editedEmail.value = item.email;

    // 編集ボタンの連打で保存ボタンが押下されるため一定時間非活性化
    setTimeout(() => {
        editCooldown.value = false;
    }, 300);
};

const saveEdits = async (item: { userId: string; userName: string; email: string }) => {
    showNotification.value = false;
    message.value = await updateUserInfo({ userId: item.userId, userName: editedUserName.value, email: editedEmail.value });
    showNotification.value = true;
    editingItem.value = null;
    emit('user-updated');
};

const cancelEditing = () => {
    editingItem.value = null;
};

const confirmDelete = (item: { userId: string; userName: string; }) => {
    deleteItem.value = item.userId;
    deleteItemName.value = item.userName;
    showConfirmModal.value = true;
};

const deleteUser = async () => {
    if (deleteItem.value) {
        await deleteUserInfo(deleteItem.value);
        showConfirmModal.value = false;
        deleteItem.value = null;
        emit('user-updated');
    }
};

const cancelDelete = () => {
    showConfirmModal.value = false;
};
</script>

<template>
    <div class="user-list">
        <ul class="list-container">
            <li class="list-item list-header">
                <Text size="large" class="item-text username">ユーザ名</Text>
                <Text size="large" class="item-text email">メールアドレス</Text>
                <Text size="large" class="item-text score">最高スコア</Text>
                <Text size="large" class="item-text rank">ランク</Text>
                <Text size="large" class="item-text">操作</Text>
            </li>
            <li v-for="item in currentItems" :key="item.userId" class="list-item">
                <template v-if="editingItem === item.userId">
                    <Input type="text" v-model="editedUserName" placeholder="ユーザ名" border="main-color" :is-rounded="true" width="large"
                        height="small" class="edit-input username" />
                    <Input type="email" v-model="editedEmail" placeholder="メールアドレス" border="main-color" :is-rounded="true" width="large"
                        height="small" class="edit-input email" />
                </template>
                <template v-else>
                    <Text size="large" class="item-text username">{{ item.userName }}</Text>
                    <Text size="large" class="item-text email">{{ item.email }}</Text>
                </template>
                <Text size="large" class="item-text score">{{ item.todaysMaxScore }}</Text>
                <Text size="large" class="item-text rank">{{ item.userRank }}</Text>
                <div class="button-container">
                    <template v-if="editingItem === item.userId">
                        <Button type="button" button-text="保存" border="main-color" :is-rounded="true"
                            @click="saveEdits(item)" @dblclick.prevent :disabled="editCooldown" />
                        <Button type="button" button-text="キャンセル" border="main-color" :is-rounded="true"
                            @click="cancelEditing" />
                    </template>
                    <template v-else>
                        <Button type="button" button-text="編集" border="main-color" :is-rounded="true"
                            @click="startEditing(item)" />
                        <Button type="button" button-text="削除" border="main-color" :is-rounded="true"
                            @click='confirmDelete(item)' />
                    </template>
                </div>
            </li>
        </ul>
    </div>
    <div class="pagination-container">
        <BasePagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
    </div>
    <BaseNotification :message="message" :content="`ユーザ名：${editedUserName}\nメールアドレス：${editedEmail}`"
        :show="showNotification" class="u-pre-wrap" />
    <ConfirmModal :show='showConfirmModal' :message="`${deleteItemName}を削除しますか？`" @confirm='deleteUser'
        @cancel='cancelDelete' />
</template>

<style lang="scss" scoped>
.user-list {
    width: 100%;
    @include horizontal-centered-flex
}

.list-container {
    width: 90%;
    padding: 0;
    list-style-type: none;
}

.list-item {
    display: grid;
    grid-template-columns: 2fr 3fr 1fr 1fr 2fr;
    gap: 10px;
    align-items: center;
    width: 100%;
    border: 1px solid $main-color;
    border-radius: 8px;
    padding: 3px;
    margin-bottom: 5px;
}

.item-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.button-container {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.pagination-container {
    position: fixed;
    bottom: 3%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    z-index: 10;
}

.edit-input {
    width: 100%;
    height: 1.5rem;
    padding: 5px;
    background-color: transparent;
    border: 1px solid $hover-color;
    border-radius: 4px;
}

.u-pre-wrap {
    white-space: pre-wrap;
}

@media (max-width: 1268px) {
    .list-item {
        font-size: 0.9em;
    }
}

@media (max-width: 1026px) {
    .list-item {
        grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
        font-size: 0.8em;
    }
}

@media (max-width: 721px) {
    .list-item {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            "username email"
            "score rank"
            "buttons buttons";
        gap: 5px;
        font-size: 0.7em;
    }

    .username {
        grid-area: username;
    }

    .email {
        grid-area: email;
    }

    .score {
        grid-area: score;
    }

    .rank {
        grid-area: rank;
    }

    .button-container {
        grid-area: buttons;
        justify-content: center;
    }
}
</style>