<script setup lang="ts">
import Loading from "~/components/molecules/common/ui/Loading.vue";

const isLoading = ref(true);

onMounted(() => {
  useHead({
    title: "Saltypeへようこそ!!"
  })
})
</script>

<template>
  <Loading :is-loading="isLoading" />
</template>