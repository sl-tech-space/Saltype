<script setup lang="ts">
import AuthHeader from "~/components/organisms/auth/AuthHeader.vue";
import Request from "~/components/organisms/settings/user/password/forgot/Request.vue";
</script>

<template>
  <div class="page">
    <AuthHeader />
    <Request />
  </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  @extend %full-page;
  @include vertical-centered-flex;
}
</style>
