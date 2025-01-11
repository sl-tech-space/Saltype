<script setup lang="ts">
import BaseTimer from '../common/BaseTimer.vue';

const { $bus } = useNuxtApp();

const isTimerEnded = ref(false);

const handleTimerEnd = () => {
    isTimerEnded.value = true;
    $bus.$emit('timer-ended');
}
</script>
<!-- 180000 - 3分 -->
<template>
    <BaseTimer :duration="180000" barColor="main-color" @timerEnd="handleTimerEnd" />
</template>