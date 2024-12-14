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

/* PC用のメディアクエリ */
@media (min-width: 1200px) {
  .text--small {
    font-size: 14px;
  }

  .text--medium {
    font-size: 16px;
  }

  .text--large {
    font-size: 18px;
  }
}

/* 13インチノートPC (1366x768) */
@media (min-width: 1366px) and (max-width: 1440px) {
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

/* 15.6インチノートPC (1920x1080) */
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
