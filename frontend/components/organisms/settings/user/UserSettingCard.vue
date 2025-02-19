<script setup lang="ts">
import UserInfo from '~/components/molecules/settings/user/UserInfo.vue';
import UpdateUserName from '~/components/molecules/settings/user/UpdateUserName.vue';
import UpdatePassword from '~/components/molecules/settings/user/UpdatePassword.vue';
import MenuCard from '~/components/molecules/settings/user/MenuCard.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import BaseNotification from '~/components/molecules/common/BaseNotification.vue';
import { useUserSetting } from '~/composables/settings/useUserSetting';
import { useErrorNotification } from '~/composables/common/useError';

const currentCard = ref('userInfo');
const isReverse = ref(false);
const { getUserInfo, userItem, isLoading, error } = useUserSetting();
const { showErrorNotification } = useErrorNotification(error);

const changeCard = (cardName: string) => {
    isReverse.value = ['updateUserName', 'updatePassword'].includes(currentCard.value) && cardName === 'userInfo';
    currentCard.value = cardName;
};

const userInfoProps = computed(() => ({
    userId: userItem.value?.user_id,
    userName: userItem.value?.username,
    email: userItem.value?.email,
    passwordExists: userItem.value?.password_exists
}));

const refreshUserInfo = async () => {
    await getUserInfo();
};

onMounted(async () => {
    await refreshUserInfo();
});
</script>

<template>
    <main class="settings-card">
        <div class="left-card">
            <transition :name="isReverse ? 'slide-reverse' : 'slide'" mode="out-in">
                <component :is="currentCard === 'userInfo' ? UserInfo :
                    currentCard === 'updateUserName' ? UpdateUserName :
                        currentCard === 'updatePassword' ? UpdatePassword : null
                    " :key="currentCard" v-bind="userInfoProps" @user-updated="refreshUserInfo" />
            </transition>
        </div>
        <div class="right-card">
            <MenuCard @change-card="changeCard" />
        </div>
    </main>
    <Loading :isLoading="isLoading" />
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
</template>

<style lang="scss" scoped>
.settings-card {
    width: 100%;
    height: 75vh;
    position: relative;
    display: flex;
    justify-content: space-around;
    gap: 5%;

    .left-card {
        flex: 6;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        overflow: hidden;
    }

    .right-card {
        flex: 4;
        display: flex;
        align-items: center;
    }
}

.slide-enter-active,
.slide-leave-active,
.slide-reverse-enter-active,
.slide-reverse-leave-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-reverse-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-reverse-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>