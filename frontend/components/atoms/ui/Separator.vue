<script setup lang="ts">
interface Props {
  color?: "white" | "black" | "main-color" | "sub-color";
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
  <div v-if="props.visible" :class="[
    'separator',
    `separator--${props.color}`,
    `separator--${props.width}`,
    `separator--${props.margin}`,
  ]"></div>
</template>

<style lang="scss" scoped>
.separator {
  align-self: center;
  border-bottom: 1px solid;
}

.separator--white {
  border-color: $white;
}

.separator--black {
  border-color: $black;
}

.separator--main-color {
  border-color: $main-color;
}

.separator--sub-color {
  border-color: $sub-color;
}

.separator--small {
  width: 15%;
}

.separator--medium {
  width: 50%;
}

.separator--large {
  width: 90%;
}

.separator--none {
  margin: 0;
}

.separator--vertical {
  margin: 35px 0;
}

.separator--horizontal {
  margin: 0 35px;
}

@media (max-width: 992px) {
  .separator--small {
    width: 20%;
  }

  .separator--medium {
    width: 60%;
  }

  .separator--large {
    width: 95%;
  }

  .separator--vertical {
    margin: 30px 0;
  }

  .separator--horizontal {
    margin: 0 30px;
  }
}

@media (max-width: 768px) {
  .separator--small {
    width: 25%;
  }

  .separator--medium {
    width: 70%;
  }

  .separator--large {
    width: 100%;
  }

  .separator--horizontal {
    margin: 0 25px;
  }
}

@media (max-width: 576px) {
  .separator--small {
    width: 30%;
  }

  .separator--medium {
    width: 80%;
  }

  .separator--horizontal {
    margin: 0 20px;
  }
}

@media (max-height: 768px) {
  .separator--vertical {
    margin: 25px 0;
  }
}

@media (max-height: 576px) {
  .separator--vertical {
    margin: 0;
  }
}
</style>
