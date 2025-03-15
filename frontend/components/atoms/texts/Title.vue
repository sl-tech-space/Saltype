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
  font-size: clamp(1.1rem, 1.3vw + 0.8rem, 1.8rem);
}

.title--medium {
  font-size: clamp(1.5rem, 1.7vw + 0.8rem, 2.2rem);
}

.title--large {
  font-size: clamp(2rem, 2.2vw + 0.8rem, 2.7rem);
}

/* responsive */
@media (min-width: 1200px) and (max-width: 1600px) {
  .title--small {
    font-size: clamp(1.0rem, 1.3vw + 0.7rem, 1.8rem);
  }

  .title--medium {
    font-size: clamp(1.4rem, 1.7vw + 0.7rem, 2.2rem);
  }

  .title--large {
    font-size: clamp(1.9rem, 2.2vw + 0.7rem, 2.7rem);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title--small {
    font-size: clamp(0.9rem, 1.1vw + 0.6rem, 1.6rem);
  }

  .title--medium {
    font-size: clamp(1.3rem, 1.5vw + 0.6rem, 2rem);
  }

  .title--large {
    font-size: clamp(1.7rem, 2vw + 0.6rem, 2.5rem);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title--small {
    font-size: clamp(0.6rem, 0.9vw + 0.5rem, 1.4rem);
  }

  .title--medium {
    font-size: clamp(1.1rem, 1.3vw + 0.5rem, 1.8rem);
  }

  .title--large {
    font-size: clamp(1.5rem, 1.8vw + 0.5rem, 2.3rem);
  }
}
</style>
