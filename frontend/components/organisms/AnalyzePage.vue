<script setup lang="ts">
import AnalyzeHeader from "../molecules/analyze/AnalyzeHeader.vue";
import AnalyzeCards from "../molecules/analyze/AnalyzeCards.vue";
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
    <AnalyzeCards />
  </div>
</template>