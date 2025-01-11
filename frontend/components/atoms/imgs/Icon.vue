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
  alt: "アイコン",
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
$large: 100px;

.icon {
  display: inline-block;
  vertical-align: middle;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 100%;
  height: auto;
}

@mixin icon-size($size) {
  width: $size;
  height: $size;
}

.icon-width--small,
.icon-height--small {
  @include icon-size($small);
}

.icon-width--medium,
.icon-height--medium {
  @include icon-size($medium);
}

.icon-width--large,
.icon-height--large {
  @include icon-size($large);
}

@media (max-width: 768px) {

  .icon-width--large,
  .icon-height--large {
    @include icon-size($medium);
  }
}

@media (max-width: 480px) {

  .icon-width--medium,
  .icon-height--medium,
  .icon-width--large,
  .icon-height--large {
    @include icon-size($small);
  }
}
</style>