<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import DifficultyLevel from './carousels/DifficultyLevel.vue';
import Language from './carousels/Language.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
</script>

<template>
    <div class="select-cards">
        <BaseCard width="xl" height="xl" :footer-sep="false" class="game-card">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="タイピング" class="card-text" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <div class="language-setting">
                        <Title size="small" text="言語選択" />
                        <Separator color="blue" margin="vertical" />
                        <Language />
                        <Separator color="blue" margin="vertical" />
                    </div>
                    <div class="difficulty-setting">
                        <Title size="small" text="難易度選択" />
                        <Separator color="blue" margin="vertical" />
                        <DifficultyLevel />
                        <Separator color="blue" margin="vertical" />
                    </div>
                </div>
            </template>
            <template #card-footer>
                <div class="footer-content">
                    <Button border="blue" width="same-as-input-large" height="large" background="none" :rounded="true"
                    button-text="スタート" class="start-button" />
                </div>
            </template>
        </BaseCard>
        <BaseCard width="small" height="xl" :footer-sep="false" class="menu-card">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="メニュー" class="card-text" />
                </div>
            </template>
            <template #card-body>
                <div class="menu-select">
                    <Text size="large" text="ランキング" />
                    <Text size="large" text="分析" />
                </div>
            </template>
        </BaseCard>
    </div>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/select-card.scss" />