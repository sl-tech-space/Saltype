<script setup lang="ts">
import TypoFrequencyCard from './cards/TypoFrequencyCard.vue';
import GrowthChartCard from './cards/GrowthChartCard.vue';
</script>

<template>
    <div class="analyze-cards-container">
        <div class="top-card">
            <TypoFrequencyCard />
        </div>
        <div class="bottom-card">
            <GrowthChartCard />
        </div>
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/analyze-cards.scss" />