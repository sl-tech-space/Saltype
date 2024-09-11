<script setup lang="ts">
interface Props {
    duration: number
    backColor?: "white" | "black" | "blue" | "dark-blue";
    barColor?: "white" | "black" | "blue" | "dark-blue";
}

const props = withDefaults(defineProps<Props>(), {
    backColor: "blue",
    barColor: "black"
});

const progress = ref<number>(0)
const isRunning = ref<boolean>(false)
let intervalId: number | null = null

const startTimer = (): void => {
    if (isRunning.value) return

    isRunning.value = true
    const startTime = Date.now()
    intervalId = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime
        progress.value = Math.min((elapsedTime / props.duration) * 100, 100)
        if (progress.value === 100) {
            if (intervalId !== null) {
                clearInterval(intervalId)
            }
            isRunning.value = false
        }
    }, 100)
}

const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
        startTimer()
    }
}

onMounted(() => {
    window.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
    if (intervalId !== null) {
        clearInterval(intervalId)
    }
    window.removeEventListener('keypress', handleKeyPress)
})
</script>

<template>
    <div :class="[`timer-bar-container`, `timer-bar-container--${props.backColor}`]">
        <div :class="[`timer-bar`, `timer-bar--${props.barColor}`]" :style="{ width: `${progress}%` }"></div>
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/base-timer.scss" />
