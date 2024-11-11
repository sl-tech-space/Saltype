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
  font-size: clamp(12px, 0.875vw + 8px, 14px);
}

.text--medium {
  font-size: clamp(14px, 1vw + 10px, 16px);
}

.text--large {
  font-size: clamp(16px, 1.25vw + 12px, 20px);
}

/* responsive */
@media (min-width: 1200px) and (max-width: 1600px) {
  .text--small {
    font-size: clamp(13px, 0.9375vw + 8.5px, 15px);
  }

  .text--medium {
    font-size: clamp(15px, 1.0625vw + 10.5px, 17px);
  }

  .text--large {
    font-size: clamp(18px, 1.3125vw + 12.5px, 22px);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .text--small {
    font-size: clamp(12px, 0.8125vw + 8px, 14px);
  }

  .text--medium {
    font-size: clamp(14px, 0.9375vw + 10px, 16px);
  }

  .text--large {
    font-size: clamp(17px, 1.1875vw + 12px, 20px);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .text--small {
    font-size: clamp(11px, 0.75vw + 7.5px, 13px);
  }

  .text--medium {
    font-size: clamp(13px, 0.875vw + 9.5px, 15px);
  }

  .text--large {
    font-size: clamp(15px, 1.0625vw + 11.5px, 18px);
  }
}
</style>
