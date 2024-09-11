<script setup lang="ts">
import TypingPage from "~/components/organisms/TypingPage.vue";

useHead({
  title: "タイピング"
});
</script>

<template>
  <main class="typing-page">
    <TypingPage />
  </main>
</template>

<style lang="scss" src="@/assets/styles/pages/typing.scss" />