<script setup lang="ts">
import HomeHeader from '../molecules/home/Header.vue';
import SelectCard from '../molecules/home/SelectCard.vue';
import CursorEffect from "~/composables/ui/CursorEffect.vue";
</script>

<template>
    <CursorEffect />
    <div class="home-page">
        <HomeHeader />
        <SelectCard />
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/organisms/home-page.scss" />
