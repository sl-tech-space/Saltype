<script setup lang="ts">
import AnalyzeHeader from "../molecules/analyze/AnalyzeHeader.vue";
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import { useSession } from "~/composables/server/useSession";

const { getSession } = useSession()

onMounted(() => {
  getSession()
})
</script>

<template>
  <CursorEffect />
  <div class="analyze-page">
    <AnalyzeHeader />
  </div>
</template>