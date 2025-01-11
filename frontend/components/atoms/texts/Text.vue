<script setup lang="ts">
interface Props {
  color?: "white" | "black" | "main-color" | "sub-color";
  size?: "small" | "medium" | "large";
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "white",
  size: "medium",
  text: "",
});
</script>

<template>
  <p :class="[`text--${props.color}`, `text--${props.size}`]">
    <slot></slot>
    {{ props.text }}
  </p>
</template>

<style lang="scss" scoped>
/** text **/
.text--white {
  color: $white;
}

.text--black {
  color: $black;
}

.text--main-color {
  color: $main-color;
}

.text--sub-color {
  color: $sub-color;
}

/** text size **/
.text--small {
  font-size: 14px;
}

.text--medium {
  font-size: 16px;
}

.text--large {
  font-size: 18px;
}

@media (max-width: 992px) {
  .text--small {
    font-size: 13px;
  }

  .text--medium {
    font-size: 15px;
  }

  .text--large {
    font-size: 17px;
  }
}

@media (max-width: 768px) {
  .text--small {
    font-size: 12px;
  }

  .text--medium {
    font-size: 14px;
  }

  .text--large {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .text--small {
    font-size: 11px;
  }

  .text--medium {
    font-size: 13px;
  }

  .text--large {
    font-size: 15px;
  }
}

@media (min-width: 1920px) {
  .text--small {
    font-size: 15px;
  }

  .text--medium {
    font-size: 17px;
  }

  .text--large {
    font-size: 19px;
  }
}
</style>