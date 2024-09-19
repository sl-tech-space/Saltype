<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import DifficultyLevel from './carousels/DifficultyLevel.vue';
import Language from './carousels/Language.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLogout } from '~/composables/auth/useLogout';
import Loading from '~/composables/ui/Loading.vue';
import { useRouter } from '#app';
import { ref } from 'vue';
import { useSession } from '~/composables/server/useSession';

const { logout } = await useLogout();
const { getSession } = useSession();
const router = useRouter();
let isLoading = ref(false);

const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);

const handleLogout = async () => {
    await logout();
};

const handleStart = async () => {
    try {
        isLoading.value = true;

        const user = await getSession();

        if(!user || !user.value) {
            alert("セッション無効");
            router.push({ name: "login" });
            isLoading.value = false;
            return;
        }

        router.push({
            name: "typing",
            query: {
                language: selectedLanguage.value + 1,
                difficultyLevel: selectedDifficulty.value + 1,
            },
        });
        isLoading.value = false;
    } catch (error) {
        console.error("Navigation failed:", error);
    }
};
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
                        <Language v-model="selectedLanguage" />
                        <Separator color="blue" margin="vertical" />
                    </div>
                    <div class="difficulty-setting">
                        <Title size="small" text="難易度選択" />
                        <Separator color="blue" margin="vertical" />
                        <DifficultyLevel v-model="selectedDifficulty" />
                        <Separator color="blue" margin="vertical" />
                    </div>
                </div>
            </template>
            <template #card-footer>
                <div class="footer-content">
                    <Button border="blue" width="same-as-input-large" height="large" background="none" :rounded="true"
                        button-text="スタート" class="start-button" @click="handleStart" />
                </div>
            </template>
        </BaseCard>
        <BaseCard width="small" height="xl" class="menu-card">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="メニュー" class="card-text" />
                </div>
            </template>
            <template #card-body>
                <ul class="menu-select">
                    <li><Text size="large" text="ランキング" /></li>
                    <li><Text size="large" text="分析情報" /></li>
                    <li><Text size="large" text="ご要望" /></li>
                    <!-- <li><Text size="large" text="パスワード設定" /></li> -->
                </ul>
            </template>
            <template #card-footer>
                <div class="logout">
                    <Button border="dark-blue" width="large" height="large" background="none" :rounded="true"
                        button-text="ログアウト" @click="handleLogout" />
                </div>
            </template>
        </BaseCard>
    </div>
    <Loading :isLoading="isLoading" />
</template>

<style lang="sass" src="@/assets/styles/components/molecules/select-card.scss" />