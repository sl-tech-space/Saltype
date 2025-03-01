<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';

interface MistypeProps {
    miss_char: string;
    miss_count: number;
}

const props = defineProps<{
    typoFrequency: MistypeProps[];
    limit: number
}>();

const displayLimit = computed(() => Math.max(0, props.limit));
</script>

<template>
    <BaseCard width="xl" height="xl" :footer-sep="false" class="typo-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" :text="`ミス頻度TOP${displayLimit}`" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <ul>
                    <li v-for="(item, index) in props.typoFrequency.slice(0, displayLimit)" :key="index" class="typo-list">
                        <Text size="large" color="main-color">
                            {{ index + 1 }}. キー: {{ item.miss_char }}&ensp;回数: {{ item.miss_count }}
                        </Text>
                    </li>
                </ul>
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.typo-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        @include horizontal-flex;
        
        .typo-list {
            margin: calc(0.7vw) 0;
        }
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
}
</style>