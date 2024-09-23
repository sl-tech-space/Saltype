<script setup lang="ts">
import Retry from './cards/Retry.vue';
import RankCard from './cards/RankCard.vue';
import RankingCard from './cards/RankingCard.vue';
import ScoreCard from './cards/ScoreCard.vue';
import Loading from '~/composables/ui/Loading.vue';
import { useScoreBoardParam } from '~/composables/score/useScoreBoardParam';
import { useSession } from '~/composables/server/useSession';

interface ScoreBoardData {
    highest_score: number;
    is_high_score: boolean;
    rank: string;
    ranking_position: number;
    score: number;
    average_score: number;
}

const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);
const totalCorrectTypedCount = ref(0);
const typingAccuracy = ref(0);
const scoreBoardData = ref<ScoreBoardData | null>(null);
const { getParam } = useScoreBoardParam();
const { isLoading, checkSession } = useSession();

onMounted(async () => {
    const isSessionValid = await checkSession(false);
    if (!isSessionValid) return;

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
            <ScoreCard :your-total-score="scoreBoardData?.score || 0" :your-average-score="scoreBoardData?.average_score || 0" />
            <RankCard :rank="scoreBoardData?.rank || 'データなし'" />
        </div>
        <div class="bottom-card">
            <Retry />
            <RankingCard :ranking="scoreBoardData?.ranking_position || 0" />
        </div>
    </div>
    <Loading :is-loading="isLoading" />
</template>

<style lang="scss" src="@/assets/styles/components/molecules/score-cards.scss" />