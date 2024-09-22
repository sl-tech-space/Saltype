<script setup lang="ts">
import Retry from './cards/Retry.vue';
import RankCard from './cards/RankCard.vue';
import RankingCard from './cards/RankingCard.vue';
import ScoreCard from './cards/ScoreCard.vue';
import Loading from '~/composables/ui/Loading.vue';
import { useScoreBoardParam } from '~/composables/score/useScoreBoardParam';
import { useAverageScore } from '~/composables/score/useAverageScore';

interface ScoreBoardData {
    highest_score: number;
    is_high_score: boolean;
    rank: string;
    ranking_position: number;
    score: {
        diff: number;
        lang: number;
        score: number;
        user: string;
    };
}

const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);
const totalCorrectTypedCount = ref(0);
const typingAccuracy = ref(0);
const scoreBoardData = ref<ScoreBoardData | null>(null);
const averageScore = ref(0);
let isLoading = ref(true);
const { getParam } = useScoreBoardParam();
const { getAverageScore } = useAverageScore();

onMounted(async () => {
    const storedLanguage = localStorage.getItem("language");
    const storedDifficulty = localStorage.getItem("difficulty");
    const storedTotalCorrectTypedCount = localStorage.getItem("totalCorrectTypedCount");
    const storedTypingAccuracy = localStorage.getItem("typingAccuracy")

    if (storedLanguage && storedDifficulty &&
        storedTotalCorrectTypedCount && storedTypingAccuracy) {
        selectedLanguage.value = Number(storedLanguage) + 1;
        selectedDifficulty.value = Number(storedDifficulty) + 1;
        totalCorrectTypedCount.value = Number(storedTotalCorrectTypedCount);
        typingAccuracy.value = Number(storedTypingAccuracy);

        try {
            scoreBoardData.value = await getParam(
                selectedLanguage.value,
                selectedDifficulty.value,
                totalCorrectTypedCount.value,
                typingAccuracy.value
            );
            averageScore.value = await getAverageScore(
                selectedLanguage.value,
                selectedDifficulty.value
            )
            console.log('ScoreBoard Data:', scoreBoardData.value);
            isLoading.value = false;
        } catch (error) {
            console.error('Failed to fetch ScoreBoard data:', error);
        }
    }
});
</script>

<template>
    <div class="score-cards-container">
        <div class="top-card">
            <ScoreCard :your-total-score="scoreBoardData?.score?.score || 0" :your-average-score="averageScore" />
            <RankCard :rank="scoreBoardData?.rank || 'データなし'" />
        </div>
        <div class="bottom-card">
            <Retry />
            <RankingCard :ranking="scoreBoardData?.ranking_position || 0" />
        </div>
    </div>
    <Loading :isLoading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/score-cards.scss" />