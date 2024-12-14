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
  font-size: clamp(10px, 0.75vw + 7px, 12px);
}

.text--medium {
  font-size: clamp(12px, 0.875vw + 9px, 14px);
}

.text--large {
  font-size: clamp(14px, 1vw + 11px, 18px);
}

/* responsive */
@media (min-width: 1200px) and (max-width: 1600px) {
  .text--small {
    font-size: clamp(11px, 0.8125vw + 7.5px, 13px);
  }

  .text--medium {
    font-size: clamp(13px, 0.9375vw + 9.5px, 15px);
  }

  .text--large {
    font-size: clamp(16px, 1.125vw + 11.5px, 20px);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .text--small {
    font-size: clamp(10px, 0.6875vw + 7px, 12px);
  }

  .text--medium {
    font-size: clamp(12px, 0.8125vw + 9px, 14px);
  }

  .text--large {
    font-size: clamp(15px, 1.0625vw + 11px, 18px);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .text--small {
    font-size: clamp(9px, 0.625vw + 6.5px, 11px);
  }

  .text--medium {
    font-size: clamp(11px, 0.75vw + 8.5px, 13px);
  }

  .text--large {
    font-size: clamp(13px, 0.9375vw + 10.5px, 16px);
  }
}

/* Adjustments for 1366px to 1440px */
@media (min-width: 1366px) and (max-width: 1440px) {
  .text--small {
    font-size: clamp(11px, 0.8vw + 7px, 13px);
  }

  .text--medium {
    font-size: clamp(13px, 0.9vw + 9px, 15px);
  }

  .text--large {
    font-size: clamp(16px, 1.1vw + 11px, 20px);
  }
}

/* Adjustments for 1440px to 1920px */
@media (min-width: 1440px) and (max-width: 1920px) {
  .text--small {
    font-size: clamp(12px, 0.85vw + 7.5px, 14px);
  }

  .text--medium {
    font-size: clamp(14px, 0.95vw + 9.5px, 16px);
  }

  .text--large {
    font-size: clamp(18px, 1.2vw + 11.5px, 22px);
  }
}
</style>
