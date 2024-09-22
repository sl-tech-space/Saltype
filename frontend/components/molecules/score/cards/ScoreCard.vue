<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';

interface Props {
    yourTotalScore: number,
    yourAverageScore: number
}

const props = defineProps<Props>();
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="スコア・平均スコア" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-container">
                    <Title size="small" color="blue" :text="`今回のスコア : ${props.yourTotalScore?.toString()}`" />
                    <Title size="small" color="blue" :text="`各設定の平均スコア : ${props.yourAverageScore.toFixed(0).toString()}`" />
                </div>
            </div>
        </template>
    </BaseCard>
</template>