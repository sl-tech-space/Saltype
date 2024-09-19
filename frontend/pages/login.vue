<script setup lang="ts">
import LoginPage from "~/components/organisms/LoginPage.vue";
import Loading from "~/composables/ui/Loading.vue";
import { useAuthToken } from "~/composables/auth/useAuth";

let isLoading = ref(true);
const { authToken } = useAuthToken();

onMounted(() => {
  authToken();
  isLoading.value = false;
});

useHead({
  title: "ログイン"
});
</script>

<template>
  <main class="login-page">
    <LoginPage />
  </main>
  <Loading :isLoading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/pages/login.scss" />
