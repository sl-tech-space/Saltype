<script setup lang="ts">
import JpTyping from './ui/JpTyping.vue';
import EngTyping from './ui/EngTyping.vue';

const route = useRoute();
const language = ref("")

onMounted(async () => {
    language.value = route.query.language as string
});
</script>

<template>
    <JpTyping v-if="language === '1'"/>
    <EngTyping v-else />
</template>