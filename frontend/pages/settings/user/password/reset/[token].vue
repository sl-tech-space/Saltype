<script setup lang="ts">
import AuthHeader from '~/components/organisms/auth/AuthHeader.vue';
import Reset from '~/components/organisms/settings/user/password/reset/Reset.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { usePasswordReset } from '~/composables/settings/usePasswordReset';

const route = useRoute();
const token = computed(() => {
  const routeToken = route.params.token;
  return Array.isArray(routeToken) ? routeToken[0] : routeToken;
});
const { tokenIsValid, isLoading } = usePasswordReset();

onMounted(async () => {
    const isValid = await tokenIsValid(token.value);
    if (!isValid) {
        await navigateTo({ name: "login" });
    }
});
</script>

<template>
    <div class="page">
        <AuthHeader />
        <Reset :token="token" />
        <Loading :is-loading="isLoading" />
    </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  @extend %full-page;
  @include vertical-centered-flex;
}
</style>
