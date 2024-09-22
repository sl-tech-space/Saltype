<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useTypoFrequency } from '~/composables/analyze/useTypoFrequency';

const { typoFrequencyTop3, getTypoFrequencyTop3 } = useTypoFrequency();

onMounted(() => {
    getTypoFrequencyTop3();
});
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="ミス頻度TOP3" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <ul>
                    <li v-for="(item, index) in typoFrequencyTop3" :key="index" style="margin-top: 10px;">
                        <Text size="large">
                            {{ index + 1 }}. キー: {{ item.miss_char }}&ensp;回数: {{ item.miss_count }}
                        </Text>
                    </li>
                </ul>
            </div>
        </template>
    </BaseCard>
</template>