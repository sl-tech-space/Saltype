<script setup lang="ts">
import Loading from "~/components/molecules/common/ui/Loading.vue";

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