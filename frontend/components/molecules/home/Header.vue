<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue';
import Separator from '~/components/atoms/ui/Separator.vue';

const Icon = defineAsyncComponent(() => import('~/components/atoms/imgs/Icon.vue'))
</script>

<template>
    <section>
        <div class="selection-prompt">
            <Title color="white" text="ホーム" />
            <Icon alt="ユーザアイコン" width="medium" height="medium" />
        </div>
        <Separator color="dark-blue" width="large" margin="none" :visible="true" />
    </section>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/header.scss" />