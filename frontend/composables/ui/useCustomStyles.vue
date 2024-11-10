<script setup lang="ts">
import { useColorStore } from '~/store/colorStore'

const colorStore = useColorStore()

const styles = computed(() => `
  <style>
    :root {
      --text-color: ${colorStore.value.textColor};
      --background-color: ${colorStore.value.backgroundColor};
      --main-color: ${colorStore.value.mainColor};
      --sub-color: ${colorStore.value.subColor};
      --hover-color: ${colorStore.value.hoverColor};
    }
  </style>
`)
</script>

<template>
  <div v-html="styles"></div>
</template>