<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Field from '../../common/ValidateField.vue';
import { Form } from 'vee-validate';
import * as yup from "yup";

const prompt = ref("");

const emit = defineEmits(['prompt-updated']);

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

const handleSubmit = () => {
    prompt.value = prompt.value.trim();
    emit('prompt-updated', prompt.value);
};
</script>

<template>
    <div>
        <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
            <Field v-model="prompt" name="prompt" class="field">
                <template #input="{ field }">
                    <span>
                        <Input type="text" id="prompt" v-bind="field" placeholder="&nbsp;プロンプト" border="main-color"
                            :is-rounded="true" />
                    </span>
                </template>
            </Field>
            <div class="buttons">
                <Button type="reset" button-text="リセット" border="main-color" :is-rounded="true" />
                <Button type="submit" button-text="変更" border="main-color" :is-rounded="true" :disabled="!valid"
                    @click="handleSubmit" @dblclick.prevent />
            </div>
        </Form>
    </div>
</template>

<style lang="scss" scoped>
.buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>