<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
</script>

<template>
    <BaseCard width="xl" height="xl" class="user-info">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="ユーザ情報" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-content-container">

                </div>
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.header-content {
    margin-left: 4%;
}

.body-content {
    width: 100%;
    height: 100%;
    @include vertical-centered-flex;
}
</style>