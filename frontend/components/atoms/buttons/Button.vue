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
/* text */
.button-text--white {
  color: $white;
}

.button-text--black {
  color: $black;
}

.button-text--main-color {
  color: $main-color;
}

.button-text--sub-color {
  color: $sub-color;
}

/* border */
.button-border--white {
  border-color: $white;
}

.button-border--black {
  border-color: $black;
}

.button-border--main-color {
  border-color: $main-color;
}

.button-border--sub-color {
  border-color: $sub-color;
}

.button-border--none {
  border: none;
}

/* width */
.button-width--small {
  max-width: 100%;
  width: 80px;
}

.button-width--medium {
  max-width: 100%;
  width: 120px;
}

.button-width--large {
  max-width: 100%;
  width: 160px;
}

.button-width--same-as-input-large {
  max-width: 100%;
  width: 350px;
}

/* height */
.button-height--small {
  max-height: 100%;
  height: 30px;
}

.button-height--medium {
  max-height: 100%;
  height: 40px;
}

.button-height--large {
  max-height: 100%;
  height: 50px;
}

/* background */
.button-background--white {
  background-color: $white;
}

.button-background--black {
  background-color: $black;
}

.button-background--main-color {
  background-color: $main-color;
}

.button-background--sub-color {
  background-color: $sub-color;
}

.button-background--none {
  background-color: transparent;
}

/* round */
.button--rounded {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* hover */
button:hover {
  border-color: $hover-color;
  cursor: pointer;

  &:disabled {
    border-color: $disabled-color;
  }
}

button:disabled {
  border-color: $disabled-color;
  cursor: not-allowed;
  opacity: 0.6;
}

/* responsive */
@media (max-width: 1200px) {
  .button-width--large {
    width: 140px;
  }

  .button-width--same-as-input-large {
    width: 300px;
  }
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

  .button-width--same-as-input-large {
    width: 100%;
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
    font-size: 14px;
  }
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
