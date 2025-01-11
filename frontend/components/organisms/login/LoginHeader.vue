<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue'
import Icon from '~/components/atoms/imgs/Icon.vue'
import SaltypeIcon from '~/assets/images/common/saltype-icon.png'
</script>

<template>
    <header class="brand">
        <div class="brand-content">
            <Icon :src="SaltypeIcon" alt="Saltypeアイコン" width="large" height="large" />
            <Title text="Saltype" size="large" />
        </div>
    </header>
</template>

<style lang="scss" scoped>
.brand {
    @include horizontal-centered-flex;
    align-items: center;
    padding-bottom: 20px;
    width: 100%;

    &-content {
        display: flex;
        align-items: center;
        gap: 20px;
    }
}
</style>
