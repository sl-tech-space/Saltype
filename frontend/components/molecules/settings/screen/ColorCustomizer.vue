<script setup lang="ts">
import Label from '~/components/atoms/labels/Label.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import { useColorStore } from '~/store/colorStore'

const { colorStore, setColor, resetColors } = useColorStore()

// 現在のモードを判定
const isDarkMode = computed(() =>
    colorStore.value.backgroundColor === '#141414'
);

const customLabels = {
    mainColor: "メインの色設定",
    subColor: "サブの色設定",
    hoverColor: "ホバー時の色設定"
};

const toggleColorMode = () => {
    if (!isDarkMode.value) {
        // ダークモードに切り替え
        setColor('backgroundColor', '#141414');
        setColor('textColor', '#ffffff');
    } else {
        // ライトモードに切り替え
        setColor('backgroundColor', '#dcdcdc');
        setColor('textColor', '#000000');
    }
};

const updateColor = (name: string, event: Event) => {
    const target = event.target as HTMLInputElement
    setColor(name, target.value)
}
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="β：カラーカスタマイズ" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <div class="mode-toggle">
                        <Button border="sub-color" type="button" width="same-as-input-large" background="none"
                            :is-rounded="true" :button-text="isDarkMode ? 'ライトモードに切替' : 'ダークモードに切替'"
                            @click="toggleColorMode" />
                    </div>
                    <div class="grid-container">
                        <div v-for="(color, name) in colorStore" :key="name" class="palette">
                            <template v-if="name !== 'textColor' && name !== 'backgroundColor'">
                                <Label :for="name" color="white" :label="customLabels[name]" />
                                <Input :id="name" type="color" :value="color"
                                    @input="(event: Event) => updateColor(name, event)" class="color-selector" />
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <template #card-footer>
                <div class="footer-content">
                    <Button border="sub-color" type="button" width="same-as-input-large" background="none"
                        :is-rounded="true" button-text="デフォルトに戻す" @click="resetColors" class="reset-button" />
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
    @include vertical-centered-flex;

    .grid-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .palette {
        @include vertical-flex;
        align-items: center;
    }

    .color-selector {
        max-width: 100%;
        width: 50%;
    }
}

.footer-content {
    width: 100%;
    height: 100%;
    @include vertical-centered-flex;

    .reset-button {
        margin: 0 auto;
    }
}

.mode-toggle {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>