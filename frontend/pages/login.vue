<script setup lang="ts">
import LoginPage from "~/components/organisms/LoginPage.vue";
import Loading from "~/composables/ui/Loading.vue";
import { useAuthToken } from "~/composables/auth/useAuth";

const { authToken } = useAuthToken();
let isLoading = ref(true);

onMounted(() => {
  authToken();
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

useHead({
  title: "ログイン"
});
</script>

<template>
  <main class="login-page">
    <LoginPage />
  </main>
  <Loading :is-loading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/pages/login.scss" />
