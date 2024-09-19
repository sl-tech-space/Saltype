<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import ScoreHeader from "../molecules/score/ScoreHeader.vue";

</script>

<template>
    <CursorEffect />
    <div class="score-page">
        <ScoreHeader />
    </div>
</template>

<style lang="scss" src="@/assets/styles/components/organisms/score-page.scss" />
