<script setup lang="ts">
import BaseRankingCard from '~/components/molecules/ranking/BaseRankingCard.vue';

</script>

<template>
    <div class="ranking-cards">
        <BaseRankingCard v-for="card in rankingCards" :key="card.id" :difficulty-name="card.difficultyName"
            :rankings="card.rankings" />
    </div>
</template>

<style scoped>
.ranking-cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>