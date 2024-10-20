<script setup lang="ts">
import RetryCard from '~/components/molecules/score/RetryCard.vue';
import RankCard from '~/components/molecules/score/RankCard.vue';
import RankingCard from '~/components/molecules/score/RankingCard.vue';
import ScoreCard from '~/components/molecules/score/ScoreCard.vue';
import { useScoreBoardParam } from '~/composables/score/useScoreBoardParam';

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
        } catch (error) {
            console.error('Failed to fetch ScoreBoard data:', error);
        }
    }
});
</script>

<template>
    <main class="score-cards-container">
        <div class="top-card">
            <ScoreCard :your-total-score="scoreBoardData?.score || 0"
                :your-average-score="scoreBoardData?.average_score || 0" />
            <RankCard :rank="scoreBoardData?.rank || 'データなし'" />
        </div>
        <div class="bottom-card">
            <RetryCard />
            <RankingCard :ranking="scoreBoardData?.ranking_position || 0" />
        </div>
    </main>
</template>

<style lang="scss" scoped>
.score-cards-container {
    width: 100%;
    height: 75vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-card,
    .bottom-card {
        width: 90%;
        height: 40%;
        display: flex;
        justify-content: space-around;
        gap: 20px;
    }

    .bottom-card,
    .body-content {
        margin-top: 3%;
    }

    .header-content {
        margin-left: 4%;
    }

    .body-content,
    .footer-content {
        display: flex;
        justify-content: center;
    }
}
</style>