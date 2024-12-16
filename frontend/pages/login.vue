<script setup lang="ts">
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import LoginHeader from "~/components/organisms/login/LoginHeader.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";
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
  <CursorEffect />
  <div class="page">
    <div class="login">
      <LoginHeader />
      <LoginForm />
      <GoogleAuth />
    </div>
  </div>
  <CopyRight />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
  @include vertical-centered-flex;
  @include hidden;

  .login {
    @include vertical-centered-flex;
  }
}
</style>
