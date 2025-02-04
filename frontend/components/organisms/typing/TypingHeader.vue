<script setup lang="ts">
import BaseHeader from '~/components/molecules/common/BaseHeader.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Timer from '~/components/molecules/typing/Timer.vue';
import TypingStats from '~/components/molecules/typing/TypingStats.vue';
</script>

<template>
    <BaseHeader>
        <template #header-left>
            <Title size="small" color="white" text="タイピング" />
        </template>
        <template #header-center>
            <div class="typing-event">
                <TypingStats />
                <Timer />
            </div>
        </template>
    </BaseHeader>
</template>

<style lang="scss" scoped>
.typing-event {
    width: 100%;
    display: flex;
    justify-content: space-around;
}
</style>