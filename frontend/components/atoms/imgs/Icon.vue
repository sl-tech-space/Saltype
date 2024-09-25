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