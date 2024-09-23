<script setup lang="ts">
import Separator from "~/components/atoms/ui/Separator.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Loading from "~/composables/ui/Loading.vue";
import { useRouter } from "#app";
import { useSession } from "~/composables/server/useSession";

const router = useRouter();
const { isLoading, checkSession } = useSession()

const handleBackToHome = async () => {
    const isSessionValid = await checkSession(true);
    if (!isSessionValid) return;

    router.push({ name: "home" })
};
</script>

<template>
    <section>
        <div class="typing-header">
            <Title color="white" text="スコアボード" />
            <Title color="white" text="タイピング結果" />
            <Button border="dark-blue" width="large" height="medium" background="none" :rounded="true" button-text="戻る"
                @click="handleBackToHome" />
        </div>
        <Separator color="dark-blue" width="large" margin="none" :visible="true" />
    </section>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing-header.scss" />