<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-vue'

interface Props {
  slides: number
  options?: EmblaOptionsType
}

const props = withDefaults(defineProps<Props>(), {
  slides: 0,
  options: () => ({})
})

const [emblaNode, emblaApi] = useEmblaCarousel(props.options)

onMounted(() => {
  if (emblaApi.value) emblaApi.value.reInit()
})

watch(() => props.slides, () => {
  if (emblaApi.value) emblaApi.value.reInit()
})

defineExpose({ emblaApi })
</script>

<template>
  <div class="embla" ref="emblaNode">
    <div class="embla__container">
      <div v-for="(slide, index) in slides" :key="index" class="embla__slide">
        <slot :name="`slide-${index}`" />
      </div>
    </div>
  </div>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/base-carousel.scss" />