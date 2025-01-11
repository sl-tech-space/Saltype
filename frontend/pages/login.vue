<script setup lang="ts">
import LoginHeader from "~/components/organisms/login/LoginHeader.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import { useAuthToken } from "~/composables/auth/useAuthToken";

const { authToken } = useAuthToken();

onMounted(() => {
  authToken();
});

onMounted(() => {
  useHead({
    title: "ログイン | Saltype"
  })
})
</script>

<template>
  <div class="page">
    <div class="login">
      <LoginHeader />
      <LoginForm />
      <GoogleAuth />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  @extend %full-page;
  @include vertical-centered-flex;

  .login {
    @include vertical-centered-flex;
  }
}
</style>
