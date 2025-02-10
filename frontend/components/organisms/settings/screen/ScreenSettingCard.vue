<script setup lang="ts">
import ColorCustomizer from '~/components/molecules/settings/screen/ColorCustomizer.vue';
import MenuCard from '~/components/molecules/settings/screen/MenuCard.vue';

const currentCard = ref('colorCustomizer');
const isReverse = ref(false);

const changeCard = (cardName: string) => {
    isReverse.value = [''].includes(currentCard.value) && cardName === 'colorCustomizer';
    currentCard.value = cardName;
};
</script>

<template>
    <main class="settings-card">
        <div class="left-card">
            <transition :name="isReverse ? 'slide-reverse' : 'slide'" mode="out-in">
                <component :is="currentCard === 'colorCustomizer' ? ColorCustomizer : null" :key="currentCard" />
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