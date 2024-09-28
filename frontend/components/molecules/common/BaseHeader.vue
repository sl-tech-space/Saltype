<script setup lang="ts">
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/composables/ui/useLoading.vue";
import { useRouter } from "#app";
import { useSession } from "~/composables/server/useSession";

interface Props {
    title?: string
}

const props = defineProps<Props>();

const router = useRouter();
const { isLoading, checkSession } = useSession()

const handleBackToHome = async () => {
    const isSessionValid = await checkSession(true);
    if (!isSessionValid) return;

    router.push({ name: "home" })
};
</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-left">
                <slot name="header-left" />
            </div>
            <div class="header-center">
                <Title v-if="props.title !== undefined && props.title !== null" size="medium" color="white" :text="props.title" />
                <slot v-else name="header-center" />
            </div>
            <div class="header-right">
                <Button v-if="props.title !== 'ホーム'" border="sub-color" width="large" height="medium" background="none" :rounded="true"
                    button-text="戻る" @click="handleBackToHome" />
                <slot v-else name="header-right" />
            </div>
        </div>
        <Separator color="sub-color" width="large" margin="none" :visible="true" />
    </header>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" scoped>
header {
    @extend %header;
}
</style>