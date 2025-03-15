<script setup lang="ts">
import BaseModal from '~/components/molecules/common/BaseModal.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Field from '~/components/molecules/common/ValidateField.vue';
import { Form } from 'vee-validate';
import * as yup from "yup";
import { useLocalStorage } from '~/composables/common/useLocalStorage';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value: boolean): void;
    (e: 'submit', value: string): void;
}>();

const modalRef = ref();
const { value: promptValue, setValue: setPrompt } = useLocalStorage('prompt', 'タイピング');
const prompt = ref(promptValue.value || 'タイピング');
const isOpen = ref(props.modelValue);

// modelValueの変更を監視
watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
    if (newValue) {
        prompt.value = promptValue.value || 'タイピング';
    }
});

// isOpenの変更を監視してemit
watch(isOpen, (newValue) => {
    emit('update:model-value', newValue);
});

const validationSchema = computed(() => {
    return yup.object().shape({
        prompt: yup.string()
            .required('キーワードを入力してください')
            .min(1, '1文字以上入力してください')
            .max(10, '10文字以内で入力してください')
            .matches(
                /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/,
                "ひらがな、カタカナ、漢字のみ入力可能です"
            ).label("キーワード"),
    });
});

const onBackClick = () => {
    navigateTo({ name: 'home' });
}

const handleClose = () => {
    isOpen.value = false;
    modalRef.value?.close();
};

const handleSubmit = () => {
    prompt.value = prompt.value.trim();
    if (prompt.value) {
        setPrompt(prompt.value);
        emit('submit', prompt.value);
        handleClose();
    }
};
</script>

<template>
    <BaseModal :close-on-outside-click="false" ref="modalRef" :model-value="isOpen"
        @update:model-value="isOpen = $event">
        <template #modal-header>
            <Title size="small" color="main-color" text="AIタイピングのキーワード設定" />
        </template>
        <template #modal-body>
            <div class="prompt-form">
                <Text>
                    文章生成で使用するキーワードを入力してください。<br>
                    1文字以上10文字以内でひらがな、カタカナ、漢字のみ入力可能です。<br>
                </Text>
                <Form :validation-schema="validationSchema" @submit="handleSubmit">
                    <Field v-model="prompt" name="prompt" class="field">
                        <template #input="{ field }">
                            <span>
                                <Input type="text" id="prompt" v-bind="field" placeholder="例：タイピング" border="main-color"
                                    width="large" :is-rounded="true" />
                            </span>
                        </template>
                    </Field>
                    <div class="modal-buttons">
                        <Button type="submit" button-text="送信" width="large" border="main-color" :is-rounded="true"
                            @dblclick.prevent />
                    </div>
                </Form>
                <Text><br>~&nbsp;注意事項&nbsp;~<br></Text>
                <Text class="prompt-form-text">
                    １．キーワードは文章生成で使用されます。<br>
                    ２．β版のため正しい文章が生成されるとは限りません。<br>
                    ３．文章生成には時間がかかる場合があります。<br>
                    ４．挑戦結果は成績に反映されません。<br>
                    ５．入力したキーワードはAI学習に使用されます。<br>
                </Text>
            </div>
        </template>
        <template #modal-footer>
            <div class="footer-content">
                <Button border="sub-color" width="large" height="medium" background="none" :is-rounded="true"
                    button-text="ホームに戻る" @click="onBackClick" />
            </div>
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
.prompt-form {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    .field {
        width: 100%;
        margin-bottom: 20px;
    }
}

.modal-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 100%;
}

.footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 20px;
}

.prompt-form-text {
    text-align: left;
}
</style>