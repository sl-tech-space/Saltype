<script setup lang="ts">
import DefaultUserIcon from "~/assets/images/home/default-user-icon.png"

interface Props {
    src?: string | Ref<string>;
    alt?: string;
    width?: "small" | "medium" | "large";
    height?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
    src: DefaultUserIcon,
    width: "medium",
    height: "medium"
});

const imageSrc = computed(() => {
    return typeof props.src === 'object' && 'value' in props.src
        ? props.src.value
        : props.src;
});
</script>

<template>
    <img :src="`${imageSrc}`" :alt="`${props.alt}`"
        :class="[`icon, icon-width--${props.width}`, `icon-height--${props.height}`]" />
</template>

<style lang="scss" scoped>
$small: 36px;
$medium: 64px;
$large: 128px;

.icon {
  display: inline-block;
  vertical-align: middle;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-width--small {
  width: $small;
}

.icon-width--medium {
  width: $medium;
}

.icon-width--large {
  width: $large;
}

.icon-height--small {
  width: $small;
}

.icon-height--medium {
  width: $medium;
}

.icon-height--large {
  width: $large;
}
</style>