<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Text from '~/components/atoms/texts/Text.vue';
</script>


<template>
    <div class="select-cards">
        <BaseCard width="xl" height="xl">
            <template #card-header>
                <Text size="large" text="タイピングコンフィグ" />
            </template>
        </BaseCard>
        <BaseCard width="small" height="xl" :footer-sep="false" >
            <template #card-header>
                <Text size="large" text="メニュー" />
            </template>
        </BaseCard>
    </div>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/select-card.scss" />