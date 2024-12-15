<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

interface Props {
    id: string
}

const props = defineProps<Props>();
const router = useRouter();
const selectedLanguageText = ref("");
const selectedDifficultyText = ref("");
const isDisabled = ref(true);

const handleStart = () => {
    router.push({ name: `typing-id`, params: { id: props.id } });
};

onMounted(() => {
    if (!props.id) {
        selectedLanguageText.value = "データが存在しません";
        selectedDifficultyText.value = "データが存在しません";
    } else {
        const splitedId = splitId(props.id);
        selectedLanguageText.value = convertNumberToJapaneseLanguageName(splitedId.left.toString());
        selectedDifficultyText.value = convertNumberToJapaneseDifficultyLevelName(splitedId.right.toString());
        isDisabled.value = false;
    }
});
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false" class="in-score-card">
        <template #card-header>
            <div class="header-content">
                <Text size="large" text="リトライ" class="card-text" />
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
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none" :rounded="true"
                    button-text="スタート" class="start-button" :disabled="isDisabled" @click="handleStart" />
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.in-score-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        margin-top: 10px;
        @include horizontal-centered-flex;
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
}
</style>