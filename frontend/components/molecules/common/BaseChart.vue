<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// プロップスの定義
const props = defineProps<{
    scores: { score: number }[];
}>();

// 最大スコアを計算
const maxScore = computed(() => Math.max(...props.scores.map(item => item.score)));

// チャートデータの計算
const chartData = computed(() => ({
    labels: Array.from({ length: props.scores.length }, (_, i) => `${i + 1}`),
    datasets: [
        {
            label: '',
            data: props.scores.map(item => item.score),
            borderColor: '#0099ff',
            tension: 0.1
        }
    ]
}));

// チャートオプションの設定
const chartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 15000,
            ticks: {
                stepSize: 1500,
                callback: (value: number | string) => value.toLocaleString()
            },
        },
        x: {
            reverse: true,
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: (context: any) => `スコア: ${context.parsed.y.toLocaleString()}`
            }
        }
    }
}));
</script>

<template>
    <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/base-chart.scss" />