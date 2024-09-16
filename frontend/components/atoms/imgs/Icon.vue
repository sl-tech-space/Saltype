<script setup lang="ts">
import DefaultUserIcon from "~/assets/images/home/default-user-icon.png"

interface Props {
    src?: string | Ref<string, string>;
    alt?: string;
    width?: "small" | "medium" | "large";
    height?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
    src: DefaultUserIcon,
    width: "medium",
    height: "medium"
});
</script>

<template>
    <img :src="`${props.src}`" :alt="`${props.alt}`"
        :class="[`icon, icon-width--${props.width}`, `icon-height--${props.height}`]" />
</template>

<style lang="sass" src="@/assets/styles/components/atoms/icon.scss" />