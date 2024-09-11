<script setup lang="ts">
import LoginPage from "~/components/organisms/LoginPage.vue";
import { useAuthToken } from "~/composables/auth/useAuth";

const { authToken } = useAuthToken();

onMounted(() => {
  authToken();
});

useHead({
  title: "ログイン"
});
</script>

<template>
  <main class="login-page">
    <LoginPage />
  </main>
</template>

<style lang="scss" src="@/assets/styles/pages/login.scss" />
