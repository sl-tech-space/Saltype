<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import Loading from "~/composables/ui/Loading.vue";
import Title from "~/components/atoms/texts/Title.vue";
import { useAuthToken } from "~/composables/auth/useAuth";

const { authToken } = useAuthToken();
let isLoading = ref(true);

onMounted(() => {
  authToken();
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
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
  <Loading :is-loading="isLoading" />
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
