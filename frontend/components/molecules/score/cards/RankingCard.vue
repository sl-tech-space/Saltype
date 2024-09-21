<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="ランキング" class="card-text" />
            </div>
        </template>
    </BaseCard>
</template>