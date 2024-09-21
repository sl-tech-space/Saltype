<script setup lang="ts">
import Retry from './cards/Retry.vue';
import RankCard from './cards/RankCard.vue';
import RankingCard from './cards/RankingCard.vue';
import TotalScoreCard from './cards/TotalScoreCard.vue';
</script>

<template>
    <div class="score-cards-container">
        <div class="top-card">
            <TotalScoreCard />
            <RankCard />
        </div>
        <div class="bottom-card">
            <Retry />
            <RankingCard />
        </div>
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/score-cards.scss" />