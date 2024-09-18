<script setup lang="ts">
import HomePage from "~/components/organisms/HomePage.vue";

useHead({
  title: "ホーム"
});
</script>

<template>
  <div class="home-page">
    <HomePage />
  </div>
</template>

<style lang="scss" src="@/assets/styles/pages/home.scss" />
