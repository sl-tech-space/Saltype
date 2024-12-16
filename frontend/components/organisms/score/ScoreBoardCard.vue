<script setup lang="ts">
import RetryCard from '~/components/molecules/score/RetryCard.vue';
import RankCard from '~/components/molecules/score/RankCard.vue';
import RankingCard from '~/components/molecules/score/RankingCard.vue';
import ScoreCard from '~/components/molecules/score/ScoreCard.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import BaseNotification from '~/components/molecules/common/BaseNotification.vue';
import { useErrorNotification } from '~/composables/common/useError';
import { useScoreBoardParam } from '~/composables/score/useScoreBoardParam';
import type { ScoreBoardData } from '~/types/score';

const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);
const scoreBoardData = ref<ScoreBoardData | null>();
const { getParam, isLoading, error } = useScoreBoardParam();
const { showErrorNotification } = useErrorNotification(error);
const id = ref<string>("");

onMounted(async () => {
    id.value = localStorage.getItem("gameModeId") as string;
    const splitedId = splitId(id.value);

    if (splitedId) {
        selectedLanguage.value = splitedId.left;
        selectedDifficulty.value = splitedId.right;

        scoreBoardData.value = await getParam(
            selectedLanguage.value,
            selectedDifficulty.value,
        );
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
            <ClientOnly>
                <RetryCard :id="id" />
            </ClientOnly>
            <RankingCard :ranking="scoreBoardData?.ranking_position || 0" />
        </div>
    </main>
    <Loading :is-loading="isLoading" />
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
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