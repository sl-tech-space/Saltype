<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import ToggleSwitch from '~/components/atoms/inputs/ToggleSwitch.vue';
import PromptSettingForm from './PromptSettingForm.vue';

// タイピング詳細表示の状態管理
const showTypingDetails = ref(localStorage.getItem('showTypingDetails') === 'true');
const prompt = ref(localStorage.getItem('prompt'));

// トグル処理
const updateTypingDetails = (value: boolean) => {
    showTypingDetails.value = value;
    localStorage.setItem('showTypingDetails', value.toString());
};

const updatePrompt = (newPrompt: string) => {
    prompt.value = newPrompt;
    localStorage.setItem('prompt', prompt.value);
};
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="タイピング画面設定" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <div class="body-content-container">
                        <div class="setting-item">
                            <Text size="medium">タイピング詳細表示</Text>
                            <ToggleSwitch v-model="showTypingDetails" @update:model-value="updateTypingDetails" />
                        </div>
                        <div class="setting-item">
                            <Text size="medium">AIタイピングプロンプト設定<br>デフォルト : 「タイピング」<br>現在の設定： {{ prompt ? prompt : 'タイピング'
                                }}</Text>
                            <PromptSettingForm @prompt-updated="updatePrompt" />
                        </div>
                    </div>
                </div>
            </template>
        </BaseCard>
    </div>
</template>

<style lang="scss" scoped>
.component-root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    align-items: center;
}

.header-content {
    margin-left: 4%;
}

.body-content {
    width: 100%;
    height: 100%;
    @include horizontal-flex;
}

.body-content-container {
    width: 100%;
    @include vertical-flex;
    padding: 0 4%;

    .setting-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0;
        padding: 10px;
        border-bottom: 1px solid var(--sub-color);

        p {
            margin: 0;
        }
    }
}
</style>