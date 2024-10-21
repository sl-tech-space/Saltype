<script setup lang="ts">
import CursorEffect from "~/composables/ui/useCursorEffect.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import Title from "~/components/atoms/texts/Title.vue";
import { useAuthToken } from "~/composables/auth/useAuthToken";

const { authToken } = useAuthToken();

onMounted(() => {
  authToken();
});

onMounted(() => {
  useHead({
    title: "ログイン"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <div class="login">
      <Title text="ログイン" class="title" />
      <LoginForm />
      <GoogleAuth />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
  @include vertical-centered-flex;
  @include hidden;

  .login {
    @include vertical-centered-flex;

    .title {
      padding-bottom: 30px;
    }
  }
}
</style>
