<script setup lang="ts">
import { useColorStore } from '~/store/colorStore'

const { colorStore } = useColorStore()

useHead({
  style: [{
    children: computed(() => `
      :root {
        --text-color: ${colorStore.value.textColor};
        --background-color: ${colorStore.value.backgroundColor};
        --main-color: ${colorStore.value.mainColor};
        --sub-color: ${colorStore.value.subColor};
        --hover-color: ${colorStore.value.hoverColor};
      }
    `)
  }]
})
</script>

<template>
  <ClientOnly />
</template>