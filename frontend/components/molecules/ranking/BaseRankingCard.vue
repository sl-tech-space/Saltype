<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
</script>

<template>
    <BaseCard width="large" height="full">
        <template #card-header>
            <div class="header-content">
                <Title size="small">

                </Title>
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-container">

                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">

            </div>
        </template>
    </BaseCard>
</template>