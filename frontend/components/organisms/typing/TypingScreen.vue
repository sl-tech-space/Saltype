<script setup lang="ts">
import TypingScreen from '~/components/molecules/typing/TypingScreen.vue';
import Keyboard from '~/components/molecules/typing/layout/Keyboard.vue';

const route = useRoute();
const language = ref("")

onMounted(() => {
    language.value = route.query.language as string
});
</script>

<template>
    <main class="typing-screen">
        <TypingScreen />
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