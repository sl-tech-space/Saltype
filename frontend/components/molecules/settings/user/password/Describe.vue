<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';

interface Props {
    title: string;
    description: string;
}

const props = defineProps<Props>();
</script>

<template>
    <div>
        <Title :text="props.title" size="small" /><br>
        <Text v-html="props.description"></Text><br>
    </div>
</template>
