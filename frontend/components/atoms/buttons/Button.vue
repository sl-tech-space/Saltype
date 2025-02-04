<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  buttonText?: string;
  color?: "white" | "black" | "main-color" | "sub-color";
  border?: "white" | "black" | "main-color" | "sub-color" | "none";
  width?: "small" | "medium" | "large" | "same-as-input-large";
  height?: "small" | "medium" | "large";
  background?: "white" | "black" | "main-color" | "sub-color" | "none";
  isRounded?: boolean;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  color: "white",
  border: "none",
  width: "medium",
  height: "medium",
  background: "black",
  isRounded: false,
  isActive: false,
});

const emit = defineEmits(['click']);
</script>

<template>
  <button :type="props.type" :class="[
    `button-text--${props.color}`,
    `button-border--${props.border}`,
    `button-width--${props.width}`,
    `button-height--${props.height}`,
    `button-background--${props.background}`,
    { 'button--rounded': props.isRounded },
    { 'active': props.isActive }
  ]" @click="emit('click')">
    <slot name="any">
      {{ props.buttonText }}
    </slot>
  </button>
</template>

<style lang="scss" scoped>
$colors: (
  white: $white,
  black: $black,
  main-color: $main-color,
  sub-color: $sub-color,
);

@each $name, $color in $colors {
  .button-text--#{"#{$name}"} {
    color: $color;
  }

  .button-border--#{"#{$name}"} {
    border-color: $color;
  }

  .button-background--#{"#{$name}"} {
    background-color: $color;
  }
}

.button-border--none {
  border: none;
}

.button-background--none {
  background-color: transparent;
}

$sizes: (
  small: (width: 80px, height: 30px),
  medium: (width: 120px, height: 40px),
  large: (width: 160px, height: 50px),
);

@each $size, $values in $sizes {
  .button-width--#{"#{$size}"} {
    max-width: 100%;
    width: if($size ==small, 80px, if($size ==medium, 120px, 160px));
  }

  .button-height--#{"#{$size}"} {
    max-height: 100%;
    height: if($size ==small, 30px, if($size ==medium, 40px, 50px));
  }
}

.button-width--same-as-input-large {
  max-width: 100%;
  width: 350px;
}

.button--rounded {
  border-radius: 4px;
}

button:disabled {
  border-color: $disabled-color;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (hover: hover) {
  button:hover {
    border-color: $hover-color;
    cursor: pointer;
    &:disabled {
      border-color: $disabled-color;
    }
  }
}
</style>
