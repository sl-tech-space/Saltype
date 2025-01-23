<script setup lang="ts">
interface Props {
  imageSrc: string;
  alt?: string;
  title?: string;
  loading?: "lazy" | "eager";
  width?: "mini" | "small" | "medium" | "large";
  height?: "mini" | "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  title: "",
  loading: "lazy",
  width: "medium",
  height: "medium",
});
</script>

<template>
  <img :src="`${props.imageSrc}`" :alt="`${props.alt}`" :title="`${props.title}`" :loading="props.loading"
    :class="[`img-width--${props.width}`, `img-height--${props.height}`]" />
</template>

<style lang="scss" scoped>
.img {
  max-width: 100%;
  height: auto;
}

.img-width {
  &--mini {
    width: 30px;
    margin-right: 10px;
  }

  &--small {
    width: 120px;
  }

  &--medium {
    width: 193px;
  }

  &--large {
    width: 278px;
  }
}

.img-height {
  &--mini {
    height: 30px;
  }

  &--small {
    height: 120px;
  }

  &--medium {
    height: 193px;
  }

  &--large {
    height: 278px;
  }
}

@media (max-width: 992px) {
  .img-width {
    &--medium {
      width: 150px;
    }

    &--large {
      width: 200px;
    }

    &--same-as-input-large {
      width: 100%;
      max-width: 250px;
    }
  }

  .img-height--large {
    height: auto;
    max-height: 200px;
  }
}

@media (max-width: 768px) {
  .img-width {
    &--small {
      width: 90px;
    }

    &--medium {
      width: 120px;
    }

    &--large {
      width: 150px;
    }

    &--same-as-input-large {
      max-width: 200px;
    }
  }

  .img-height {
    &--medium {
      height: auto;
      max-height: 150px;
    }

    &--large {
      max-height: 180px;
    }
  }
}

@media (max-width: 576px) {
  .img-width {
    &--small {
      width: 80px;
    }

    &--medium {
      width: 100px;
    }

    &--large {
      width: 120px;
    }

    &--same-as-input-large {
      max-width: 100%;
    }
  }

  .img-height {
    &--small {
      height: auto;
      max-height: 80px;
    }

    &--medium {
      max-height: 100px;
    }

    &--large {
      max-height: 120px;
    }
  }
}
</style>
