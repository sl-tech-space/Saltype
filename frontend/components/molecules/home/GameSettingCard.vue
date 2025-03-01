<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import DifficultyLevel from '../common/carousels/DifficultyLevel.vue';
import Language from '../common/carousels/Language.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import Button from '~/components/atoms/buttons/Button.vue';

const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);

const handleStart = async () => {
    const id: string = joinWithHyphen(
        (selectedLanguage.value + 1).toString(), 
        (selectedDifficulty.value + 1).toString()
    );
    localStorage.setItem("gameModeId", id);

    await navigateTo({ name: `typing-id`, params: { id: id } });
};
</script>

<template>
    <BaseCard width="xl" height="xl" :footer-sep="false" class="game-setting-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="タイピング" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-content-container">
                    <div class="language-setting">
                        <Title size="small" text="言語選択" />
                        <Separator color="main-color" margin="vertical" />
                        <Language v-model="selectedLanguage" />
                        <Separator color="main-color" margin="vertical" />
                    </div>
                    <div class="difficulty-setting">
                        <Title size="small" text="難易度選択" />
                        <Separator color="main-color" margin="vertical" />
                        <DifficultyLevel v-model="selectedDifficulty" />
                        <Separator color="main-color" margin="vertical" />
                    </div>
                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="main-color" width="same-as-input-large" height="large" background="none"
                    :is-rounded="true" button-text="スタート" class="start-button" @click="handleStart" />
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.game-setting-card {
    .header-content {
        margin-left: 4%;
    }

    .footer-content {
        @include horizontal-centered-flex;
    }

    .body-content {
        height: 100%;
        @include horizontal-flex;
        align-items: center;

        .body-content-container {
            margin-top: 10px;
            @include horizontal-centered-flex;
        }
    }
}
</style>