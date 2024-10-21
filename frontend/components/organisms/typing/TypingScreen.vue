<script setup lang="ts">
import JpTyping from '~/components/molecules/typing/JpTyping.vue';
import EngTyping from '~/components/molecules/typing/EngTyping.vue';
import Keyboard from '~/components/molecules/typing/layout/Keyboard.vue';

const route = useRoute();
const language = ref("")

onMounted(async () => {
    language.value = route.query.language as string
});
</script>

<template>
    <div class="typing-screen">
        <JpTyping v-if="language === '1'" />
        <EngTyping v-else />
        <Keyboard />
    </div>
</template>

<style lang="scss" scoped>
.typing-screen {
    width: 100%;
    height: 75vh;
    @include vertical-flex;
    justify-content: space-around;
}
</style>