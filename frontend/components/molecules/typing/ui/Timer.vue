<script setup lang="ts">
import BaseTimer from "../../common/BaseTimer.vue";

const { $bus } = useNuxtApp();

const isTimerEnded = ref(false);

const handleTimerEnd = () => {
    isTimerEnded.value = true;
    $bus.$emit('timer-ended');
}
</script>
<!-- 18000? -->
<template>
    <BaseTimer :duration="180" @timerEnd="handleTimerEnd" />
</template>