<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import Text from "~/components/atoms/texts/Text.vue";
import Title from "~/components/atoms/texts/Title.vue";

const { $bus } = useNuxtApp()

const totalCorrectTypedCount = ref(0)
const totalMistypedCount = ref(0)
const typingAccuracy = ref(0)

interface TypingStats {
    totalCorrectTypedCount: number;
    totalMistypedCount: number;
    typingAccuracy: number;
}

const updateTypingStats = (stats: TypingStats) => {
    console.log('Received stats:', stats); 
    totalCorrectTypedCount.value = stats.totalCorrectTypedCount
    totalMistypedCount.value = stats.totalMistypedCount
    typingAccuracy.value = stats.typingAccuracy * 100
}

onMounted(() => {
    $bus.$on('typing-stats', updateTypingStats as any)
})

onUnmounted(() => {
    $bus.$off('typing-stats')
})
</script>

<template>
    <div class="typing-stats">
        <Text color="white" size="medium" :text="`正タイプ数: ${totalCorrectTypedCount}`" />
        <Text color="white" size="medium" :text="`ミスタイプ数: ${totalMistypedCount}`" />
        <Text color="white" size="medium" :text="`タイピング精度: ${typingAccuracy}%`" />
    </div>
</template>

<style lang="scss" scoped>
.typing-stats {
    text-align: start;
    padding: 15px;
}
</style>
