<script setup lang="ts">
interface Props {
  color?: "white" | "black" | "blue" | "dark-blue";
  width?: "small" | "medium" | "large";
  margin?: "none" | "vertical" | "horizontal";
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "white",
  margin: "none",
  visible: true
});
</script>

<template>
  <div
    v-if="props.visible"
    :class="[
      'separator',
      `separator--${props.color}`,
      `separator--${props.width}`,
      `separator--${props.margin}`,
    ]"
  ></div>
</template>

<style lang="scss" src="@/assets/styles/components/atoms/separator.scss" />
