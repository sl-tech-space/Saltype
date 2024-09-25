<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import { useRouter } from '#app';
import { ref } from 'vue';
import { useSession } from '~/composables/server/useSession';

const { isLoading, checkSession } = useSession();
const router = useRouter();
const selectedLanguage = ref(0);
const selectedDifficulty = ref(0);
const selectedLanguageText = ref("");
const selectedDifficultyText = ref("");
const isDisabled = ref(true)

const handleStart = async () => {
    try {
        const isSessionValid = await checkSession(false);
        if (!isSessionValid) return;

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

onMounted(() => {
    const storedLanguage = localStorage.getItem("language");
    const storedDifficulty = localStorage.getItem("difficulty");

    if (storedLanguage && storedDifficulty) {
        selectedLanguage.value = Number(storedLanguage);
        selectedDifficulty.value = Number(storedDifficulty);
    }

    const languageMap = {
        0: "日本語",
        1: "英語"
    };

    const difficultyMap = {
        0: "イージー",
        1: "ノーマル",
        2: "ハード"
    };

    selectedLanguageText.value = languageMap[selectedLanguage.value as keyof typeof languageMap] || "データが存在しません";
    selectedDifficultyText.value = difficultyMap[selectedDifficulty.value as keyof typeof difficultyMap] || "データが存在しません";

    if (selectedLanguageText.value !== "データが存在しません" && selectedDifficultyText.value !== "データが存在しません") {
        isDisabled.value = false;
    }
});
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="リトライ" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="setting">
                    <Text size="large" text="現在の設定" />
                    <Text size="large" :text="`言語: ${selectedLanguageText}`" />
                    <Text size="large" :text="`難易度: ${selectedDifficultyText}`" />
                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="dark-blue" width="same-as-input-large" height="medium" background="none" :rounded="true"
                    button-text="スタート" class="start-button" :disabled="isDisabled" @click="handleStart" />
            </div>
        </template>
    </BaseCard>
</template>