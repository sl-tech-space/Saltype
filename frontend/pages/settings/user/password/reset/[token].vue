<script setup lang="ts">
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { usePasswordReset } from '~/composables/settings/usePasswordReset';

const route = useRoute();
const token = route.params.token;
const { tokenIsValid, isLoading } = usePasswordReset();

onMounted(async () => {
    const isValid = await tokenIsValid(token as string);
    if (!isValid) {
        await navigateTo({ name: "login" });
    }
});
</script>

<template>
    <div>
        <Loading :is-loading="isLoading" />
    </div>
</template>
