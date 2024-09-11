<script setup lang="ts">
import HomeHeader from '../molecules/home/Header.vue';
import SelectCard from '../molecules/home/SelectCard.vue';
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import { useSession } from '~/composables/server/useSession';

const { user, error, getSession } = useSession()

onMounted(() => {
  getSession()
  console.log(user)
})

//TODO test
watch(user, (newValue) => {
    console.log('Component: User data changed:', JSON.stringify(newValue, null, 2))
})
</script>

<template>
    <CursorEffect />
    <div class="home-page">
        <HomeHeader />
        <SelectCard />
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/organisms/home-page.scss" />
