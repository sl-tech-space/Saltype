<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import ToggleSwitch from '~/components/atoms/inputs/ToggleSwitch.vue';
import { useLocalStorage } from '~/composables/common/useLocalStorage';

// 状態管理
const isScrollAssist = ref(localStorage.getItem('isScrollAssist') === 'true');
const { value: cursorEffectValue, setValue: setCursorEffect } = useLocalStorage('isFollowCursorEffect', 'true');
const isFollowCursorEffect = ref(cursorEffectValue.value !== 'false');

// cursorEffectValueの変更を監視
watch(cursorEffectValue, (newValue) => {
    isFollowCursorEffect.value = newValue !== 'false';
});

// トグル処理
const updateScrollAssist = (value: boolean) => {
    isScrollAssist.value = value;
    localStorage.setItem('isScrollAssist', value.toString());
};

const updateFollowCursorEffect = (value: boolean) => {
    isFollowCursorEffect.value = value;
    setCursorEffect(value.toString());
};
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl" class="user-info">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="画面共通設定" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <div class="body-content-container">
                        <div class="setting-item">
                            <Text size="medium">スクロールアシスト：<br>マウスホイールで１画面のスクロールを行います。</Text>
                            <ToggleSwitch v-model="isScrollAssist" @update:model-value="updateScrollAssist" />
                        </div>
                        <div class="setting-item">
                            <Text size="medium">追従型カーソルエフェクト：<br>カーソルに追従するエフェクトを有効にします。</Text>
                            <ToggleSwitch v-model="isFollowCursorEffect"
                                @update:model-value="updateFollowCursorEffect" />
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
        width: 80%;
        max-width: 800px;
        margin: 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid var(--sub-color);

        @media screen and (max-width: 1024px) {
            width: 100%;
        }

        p {
            margin: 0;
            max-width: 70%;
        }

        .toggle-switch {
            min-width: 60px;
        }
    }
}
</style>