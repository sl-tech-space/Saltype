<script setup lang="ts">
import Loading from "~/composables/ui/useLoading.vue";

let isLoading = ref(true);

onMounted(() => {
  useHead({
    title: "Welcome"
  })
})
</script>

<template>
  <Loading :is-loading="isLoading" />
</template>