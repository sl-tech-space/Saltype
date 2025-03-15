<script setup lang="ts">
interface Props {
  for?: string;
  color?: "white" | "black" | "blue" | "dark-blue";
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  for: "",
  color: "white",
  label: "ラベル",
});
</script>

<template>
  <label :for="`${props.for}`" :class="`label--${props.color}`">
    {{ props.label }}
  </label>
</template>

<style lang="scss" scoped>
.label--white {
  color: $white;
}

.label--black {
  color: $black;
}

.label--blue {
  color: $main-color;
}

.label--dark-blue {
  color: $sub-color;
}
</style>
