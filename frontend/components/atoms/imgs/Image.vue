<script setup lang="ts">
interface Props {
  imageSrc: string;
  alt?: string;
  width?: "mini" | "small" | "medium" | "large";
  height?: "mini" | "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  width: "medium",
  height: "medium",
});
</script>

<template>
  <img :src="`${props.imageSrc}`" :alt="`${props.alt}`"
    :class="[`img-width--${props.width}`, `img-height--${props.height}`]" />
</template>

<style lang="scss" scoped>
.img-width--mini {
  width: 30px;
  margin-right: 20px;
}

.img-width--small {
  width: 120px;
}

.img-width--medium {
  width: 193px;
}

.img-width--large {
  width: 278px;
}

.img-height--mini {
  height: 30px;
}

.img-height--small {
  height: 120px;
}

.img-height--medium {
  height: 193px;
}

.img-height--large {
  height: 278px;
}
</style>
