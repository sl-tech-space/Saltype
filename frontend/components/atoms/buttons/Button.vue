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
  .button-text--#{$name} {
    color: $color;
  }

  .button-border--#{$name} {
    border-color: $color;
  }

  .button-background--#{$name} {
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
  .button-width--#{$size} {
    max-width: 100%;
    width: map-get($values, width);
  }

  .button-height--#{$size} {
    max-height: 100%;
    height: map-get($values, height);
  }
}

.button-width--same-as-input-large {
  max-width: 100%;
  width: 350px;
}

.button--rounded {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  &:hover:not(:disabled) {
    border-color: $hover-color;
    cursor: pointer;
  }

  &:disabled {
    border-color: $disabled-color;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.active {
  border-color: $sub-color;
}

@media (max-width: 992px) {
  .button-width--medium {
    width: 100px;
  }

  .button-width--large {
    width: 120px;
  }

  .button-width--same-as-input-large {
    width: 250px;
  }

  .button-height--large {
    height: 45px;
  }
}

@media (max-width: 768px) {
  .button-width--small {
    width: 70px;
  }

  .button-width--medium {
    width: 90px;
  }

  .button-width--large {
    width: 110px;
  }

  .button-width--same-as-input-large {
    width: 200px;
  }

  .button-height--medium {
    height: 35px;
  }

  .button-height--large {
    height: 40px;
  }
}

@media (max-width: 576px) {
  .button-width--small {
    width: 60px;
  }

  .button-width--medium {
    width: 80px;
  }

  .button-width--large {
    width: 100px;
  }

  .button-height--small {
    height: 28px;
  }

  .button-height--medium {
    height: 32px;
  }

  .button-height--large {
    height: 36px;
  }

  button {
    font-size: 12px;
  }
}

@media (hover: hover) {
  button:hover:not(:disabled) {
    border-color: $hover-color;
    cursor: pointer;
  }
}
</style>
