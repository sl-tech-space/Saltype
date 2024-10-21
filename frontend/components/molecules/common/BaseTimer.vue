<script setup lang="ts">
import Text from '~/components/atoms/texts/Text.vue';

interface Props {
    duration: number
    backColor?: "white" | "black" | "main-color" | "sub-color";
    barColor?: "white" | "black" | "main-color" | "sub-color";
}

const props = withDefaults(defineProps<Props>(), {
    backColor: "main-color",
    barColor: "black"
});

const emit = defineEmits(['timerEnd']);
const progress = ref<number>(100)
const isRunning = ref<boolean>(false)
const remainingMinutes = ref<number>(Math.floor(props.duration / 60000))
const remainingSeconds = ref<number>(Math.floor((props.duration % 60000) / 1000))
let intervalId: number | null = null

const startTimer = (): void => {
    if (isRunning.value) return

    isRunning.value = true
    const startTime = Date.now()
    intervalId = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime
        progress.value = Math.max(100 - (elapsedTime / props.duration) * 100, 0) // 100%から減少
        const remainingTime = Math.max(props.duration - elapsedTime, 0)
        remainingMinutes.value = Math.floor(remainingTime / 60000)
        remainingSeconds.value = Math.floor((remainingTime % 60000) / 1000)
        if (progress.value === 0 || (remainingMinutes.value === 0 && remainingSeconds.value === 0)) {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
            isRunning.value = false;

            emit('timerEnd');
        }
    }, 1000)
}


const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
        setTimeout(() => {
            startTimer();
        }, 3000);
    }
}

const remainingTimeText = computed(() => {
    const minutes = remainingMinutes.value.toString();
    const seconds = remainingSeconds.value.toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
});

const timerBarStyle = computed(() => {
  return {
    width: `${progress.value}%`,
    transition: isRunning.value ? 'width 1s linear' : 'none'
  }
})

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
    <div class="timer">
        <Text color="white" size="large" :text="remainingTimeText" />
        <div :class="[`timer-bar-container`, `timer-bar-container--${props.backColor}`]">
            <div :class="[`timer-bar`, `timer-bar--${props.barColor}`]" :style="timerBarStyle"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.timer {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    .timer-bar-container {
        width: 100%;
        height: 40px;
        border-radius: 20px;
        outline: 1px solid $sub-color;
        outline-offset: 4px;
        overflow: hidden;
        transform: scaleX(-1);

        .timer-bar {
            will-change: width;
            height: 100%;
            transition: width 1s linear;
        }

        /* bar color */
        .timer-bar--white {
            background-color: $white;
        }

        .timer-bar--black {
            background-color: $black;
        }

        .timer-bar--main-color {
            background-color: $main-color;
        }

        .timer-bar--sub-color {
            background-color: $sub-color;
        }

        /* back color */
        .timer-bar-container--white {
            background-color: $white;
        }

        .timer-bar-container--black {
            background-color: $black;
        }

        .timer-bar-container--main-color {
            background-color: $main-color;
        }

        .timer-bar-container--sub-color {
            background-color: $sub-color;
        }
    }
}
</style>