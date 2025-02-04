<script setup lang="ts">
import Text from "~/components/atoms/texts/Text.vue";
import type { TypingStatsEventBus } from "~/types/typing";
import type { TypingStats } from "~/types/typing";

declare module '#app' {
  interface NuxtApp {
    $bus: TypingStatsEventBus;
  }
}

const { $bus } = useNuxtApp()

const totalCorrectTypedCount = ref(0)
const totalMistypedCount = ref(0)
const typingAccuracy = ref(0)

const updateTypingStats = (stats: TypingStats) => {
    totalCorrectTypedCount.value = stats.totalCorrectTypedCount
    totalMistypedCount.value = stats.totalMistypedCount
    typingAccuracy.value = stats.typingAccuracy * 100
}

onMounted(() => {
    $bus.$on('typing-stats', updateTypingStats)
})

onUnmounted(() => {
    $bus.$off('typing-stats', updateTypingStats)
})
</script>

<template>
    <div class="typing-stats">
        <Text color="white" size="medium" :text="`正タイプ数: ${totalCorrectTypedCount}`" />
        <Text color="white" size="medium" :text="`ミスタイプ数: ${totalMistypedCount}`" />
        <Text color="white" size="medium" :text="`タイピング精度: ${typingAccuracy.toFixed(1)}%`" />
    </div>
</template>

<style lang="scss" scoped>
.typing-stats {
    text-align: start;
    padding: 15px;
}
</style>
