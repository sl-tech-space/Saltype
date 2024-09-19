<script setup lang="ts">
import Separator from "~/components/atoms/ui/Separator.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import { useRouter } from "#app";

const router = useRouter();

const handleBackToHome = () => {
    router.push({ name: "home" })
};
</script>

<template>
    <section>
        <div class="typing-header">
            <Title color="white" text="スコア" />
            <Title color="white" text="タイピング結果" />
            <Button border="dark-blue" width="large" height="medium" background="none" :rounded="true" button-text="戻る"
                @click="handleBackToHome" />
        </div>
        <Separator color="dark-blue" width="large" margin="none" :visible="true" />
    </section>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing-header.scss" />