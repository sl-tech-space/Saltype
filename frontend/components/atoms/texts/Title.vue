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
  <h1 :class="[`title--${props.color}`, `title--${props.size}`]" v-html="props.text" />
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

.title--small {
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
}

.title--medium {
  font-size: clamp(2rem, 2vw + 1rem, 2.5rem);
}

.title--large {
  font-size: clamp(2.5rem, 2.5vw + 1rem, 3rem);
}

/* responsive */
@media (min-width: 1200px) and (max-width: 1600px) {
  .title--small {
    font-size: clamp(1.75rem, 1.75vw + 0.9rem, 2.25rem);
  }

  .title--medium {
    font-size: clamp(2.25rem, 2.25vw + 0.9rem, 2.75rem);
  }

  .title--large {
    font-size: clamp(2.75rem, 2.75vw + 0.9rem, 3.25rem);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title--small {
    font-size: clamp(1.5rem, 1.5vw + 0.8rem, 2rem);
  }

  .title--medium {
    font-size: clamp(2rem, 2vw + 0.8rem, 2.5rem);
  }

  .title--large {
    font-size: clamp(2.5rem, 2.5vw + 0.8rem, 3rem);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title--small {
    font-size: clamp(1.25rem, 1.25vw + 0.7rem, 1.75rem);
  }

  .title--medium {
    font-size: clamp(1.75rem, 1.75vw + 0.7rem, 2.25rem);
  }

  .title--large {
    font-size: clamp(2.25rem, 2.25vw + 0.7rem, 2.75rem);
  }
}
</style>
