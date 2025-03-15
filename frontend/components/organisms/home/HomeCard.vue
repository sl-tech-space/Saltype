<script setup lang="ts">
import GameSettingCard from '~/components/molecules/home/GameSettingCard.vue';
import MenuCard from '~/components/molecules/home/MenuCard.vue';
</script>

<template>
    <main class="home-card">
        <div class="left-card">
            <GameSettingCard />
        </div>
        <div class="right-card">
            <MenuCard />
        </div>
    </main>
</template>

<style lang="scss" scoped>
.home-card {
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
    }

    .right-card {
        flex: 4;
        display: flex;
        align-items: center;
    }
}
</style>