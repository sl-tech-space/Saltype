<script setup lang="ts">
import { ref } from 'vue';
import UserInfo from '~/components/molecules/user/setting/UserInfo.vue';
import UpdateUserName from '~/components/molecules/user/setting/UpdateUserName.vue';
import UpdatePassword from '~/components/molecules/user/setting/UpdatePassword.vue';
import MenuCard from '~/components/molecules/user/MenuCard.vue';

const currentCard = ref('userInfo');
const isReverse = ref(false);

const changeCard = (cardName: string) => {
    isReverse.value = ['updateUserName', 'updatePassword'].includes(currentCard.value) && cardName === 'userInfo';
    currentCard.value = cardName;
};
</script>

<template>
    <main class="settings-card">
        <div class="left-card">
            <transition :name="isReverse ? 'slide-reverse' : 'slide'" mode="out-in">
                <component :is="currentCard === 'userInfo' ? UserInfo :
                    currentCard === 'updateUserName' ? UpdateUserName :
                        currentCard === 'updatePassword' ? UpdatePassword : null
                    " :key="currentCard" />
            </transition>
        </div>
        <div class="right-card">
            <MenuCard @change-card="changeCard" />
        </div>
    </main>
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
        width: 50%;
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