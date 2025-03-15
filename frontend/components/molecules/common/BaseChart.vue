<script setup lang="ts">
import { useColorStore } from '~/store/colorStore';
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

const { colorStore } = useColorStore();

const props = defineProps<{
    scores: number[];
}>();

// チャートデータの計算
const chartData = computed(() => ({
    labels: Array.from({ length: props.scores.length }, (_, i) => `${i + 1}`),
    datasets: [
        {
            label: '',
            data: props.scores.reverse(),
            borderColor: `${colorStore.value.mainColor}`,
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

<style lang="scss" scoped>
.chart-container {
    width: 90%;
    height: 290px;
}
</style>