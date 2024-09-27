<script setup lang="ts">
interface Props {
  color?: "white" | "black" | "main-color" | "sub-color";
  size?: "small" | "medium" | "large";
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "white",
  size: "medium",
  text: "見出し",
});
</script>

<template>
  <h1 :class="[`title--${props.color}`, `title--${props.size}`]">
    {{ props.text }}
  </h1>
</template>

<style lang="scss" scoped>
/** title text **/
.title--white {
  color: $white;
}

.title--black {
  color: $black;
}

.title--main-color {
  color: $main-color;
}

.title--sub-color {
  color: $sub-color;
}

/** title text size **/
.title--small {
  font-size: 2rem;
}

.title--medium {
  font-size: 2.5rem;
}

.title--large {
  font-size: 3rem;
}
</style>
