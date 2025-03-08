<script setup lang="ts">
import AuthHeader from "~/components/organisms/auth/AuthHeader.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import { useAuthToken } from "~/composables/auth/useAuthToken";
import { useGoogleAuth } from "~/composables/auth/useGoogleAuth";

const { authToken } = useAuthToken();
const { isLoading } = useGoogleAuth();

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
      <AuthHeader />
      <LoginForm />
      <GoogleAuth />
      <Loading :is-loading="isLoading" />
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
