<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-vue'
import Button from '~/components/atoms/buttons/Button.vue';

interface Props {
  slides: number
  options?: EmblaOptionsType
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  slides: 0,
  options: () => ({}),
  modelValue: 0
})

const emit = defineEmits(['update:modelValue'])

const [emblaNode, emblaApi] = useEmblaCarousel(props.options)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const currentSlideIndex = ref(props.modelValue)

const onSelect = (emblaApi: EmblaCarouselType) => {
  canScrollPrev.value = emblaApi.canScrollPrev()
  canScrollNext.value = emblaApi.canScrollNext()
  currentSlideIndex.value = emblaApi.selectedScrollSnap()
  emit('update:modelValue', currentSlideIndex.value)
}

const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.reInit()
    emblaApi.value.on('select', () => {
      if (emblaApi.value) {
        onSelect(emblaApi.value)
      }
    })
    onSelect(emblaApi.value)
  }
})

watch(() => props.slides, () => {
  if (emblaApi.value) {
    emblaApi.value.reInit()
    onSelect(emblaApi.value)
  }
})

defineExpose({ emblaApi, currentSlideIndex })
</script>

<template>
  <div class="embla-wrapper">
    <Button class="embla__prev" button-text="&lt;" color="blue" width="small" background="none" @click="scrollPrev" />
    <div class="embla" ref="emblaNode">
      <div class="embla__container">
        <div v-for="(slide, index) in slides" :key="index" class="embla__slide">
          <slot :name="`slide-${index}`" />
        </div>
      </div>
    </div>
    <Button class="embla__next" button-text="&gt;" color="blue" width="small" background="none" @click="scrollNext" />
  </div>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/base-carousel.scss" />