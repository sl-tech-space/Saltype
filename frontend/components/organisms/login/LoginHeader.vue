<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue'
import Icon from '~/components/atoms/imgs/Icon.vue'
import SaltypeIcon from '~/assets/images/common/saltype-icon.png'
</script>

<template>
    <header class="brand">
        <Icon :src="SaltypeIcon" alt="Saltypeアイコン" width="large" height="large" />
        <Title text="Saltype" size="large" />
    </header>
</template>

<style lang="scss" scoped>
.brand {
    @include horizontal-centered-flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 20px;
    position: relative;
    left: -64px;
}
</style>