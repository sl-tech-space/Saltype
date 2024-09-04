<script setup lang="ts">
import LoginPage from "~/components/organisms/LoginPage.vue";
import { useAuthToken } from "~/composables/auth/useAuth";

const { authToken } = useAuthToken();

onMounted(() => {
  // authToken();
});
</script>

<template>
  <div class="login-page">
    <LoginPage />
  </div>
</template>

<style lang="scss" src="@/assets/styles/pages/index.scss" />
