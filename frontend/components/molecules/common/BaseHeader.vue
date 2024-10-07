<script setup lang="ts">
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import Loading from "~/composables/ui/useLoading.vue";
import { useRouter } from "#app";

interface Props {
    title?: string
}

const props = defineProps<Props>();

const router = useRouter();

const handleBackToHome = async () => {
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
                <Title v-if="props.title !== undefined && props.title !== null" size="medium" color="white"
                    :text="props.title" />
                <slot v-else name="header-center" />
            </div>
            <div class="header-right">
                <Button v-if="props.title !== 'ホーム'" border="sub-color" width="large" height="medium" background="none"
                    :rounded="true" button-text="戻る" @click="handleBackToHome" />
                <slot v-else name="header-right" />
            </div>
        </div>
        <Separator color="sub-color" width="large" margin="none" :visible="true" />
    </header>
</template>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 25vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .header-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    .header-left,
    .header-center,
    .header-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>