<script setup lang="ts">
import TypingScreen from '~/components/molecules/typing/TypingScreen.vue';
import AITypingScreen from '~/components/molecules/typing/ai/AITypingScreen.vue';
import Keyboard from '~/components/molecules/typing/layout/Keyboard.vue';

const route = useRoute();
const isAIMode = computed(() => route.params.id as string === "ai");
</script>

<template>
    <main class="typing-screen">
        <TypingScreen v-if="!isAIMode" />
        <AITypingScreen v-else />
        <Keyboard />
    </main>
</template>

<style lang="scss" scoped>
.typing-screen {
    width: 100%;
    height: 75vh;
    @include vertical-flex;
    justify-content: space-around;
}
</style>