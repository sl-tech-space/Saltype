<script setup lang="ts">
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Separator from "~/components/atoms/ui/Separator.vue";
import { useRouter } from "#app";

interface Props {
    title?: string
    onBackClick?: string
}

const props = withDefaults(defineProps<Props>(), {
    onBackClick: "home"
});

const router = useRouter();

const onBackClick = () => {
    router.push({ name: props.onBackClick });
}
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
                    :rounded="true" button-text="戻る" @click="onBackClick" />
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
    @include vertical-centered-flex;

    .header-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    .header-left,
    .header-center,
    .header-right {
        @include horizontal-centered-flex;
        flex: 1;
        align-items: center;
    }
}
</style>