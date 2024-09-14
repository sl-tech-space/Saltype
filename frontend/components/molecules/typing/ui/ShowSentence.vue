<script setup lang="ts">

interface Props {
    selectedLanguage: string;
    selectedDifficulty: string;
}

const props = defineProps<Props>();

onMounted(() => {
    const language = props.selectedLanguage
    const difficultyLevel = props.selectedDifficulty
    console.log(language + "" + difficultyLevel)
}) 
</script>

<template>

</template>