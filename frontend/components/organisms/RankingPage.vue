<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import RankingHeader from "../molecules/ranking/RankingHeader.vue";
</script>

<template>
    <CursorEffect />
    <div class="ranking-page">
        <RankingHeader />
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/organisms/ranking-page.scss" />
