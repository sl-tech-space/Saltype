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
        <div class="ranking-header">
            <Title color="white" text="ランキング" />
            <Button border="sub-color" width="large" height="medium" background="none" :rounded="true" button-text="戻る"
                @click="handleBackToHome" />
        </div>
        <Separator color="sub-color" width="large" margin="none" :visible="true" />
    </section>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/ranking-header.scss" />