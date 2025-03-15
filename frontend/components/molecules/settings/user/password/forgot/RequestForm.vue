<script setup lang="ts">
import Field from '~/components/molecules/common/ValidateField.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import BaseNotification from '~/components/molecules/common/BaseNotification.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { Form } from "vee-validate";
import * as yup from "yup";
import { usePasswordReset } from '~/composables/settings/usePasswordReset';

const email = ref("");
const { requestResetPassword, isLoading, successNotification, error } = usePasswordReset();

/**
 * バリデーションの設定
 */
const validationSchema = yup.object().shape({
    email: yup.string().required().email().max(256).label("メールアドレス"),
});

const onBackClick = async () => {
    await navigateTo({ name: "login" });
}

const handleSubmit = async () => {
    await requestResetPassword(email.value);
    email.value = "";
}
</script>

<template>
    <div>
        <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
            <Field v-model="email" name="email" class="field">
                <template #input="{ field }">
                    <Input type="email" id="email" v-bind="field" placeholder="&nbsp;メールアドレス" border="main-color"
                        width="large" :is-rounded="true" />
                </template>
            </Field>

            <div class="buttons">
                <Button type="submit" button-text="再設定リンクを送信" border="main-color" width="same-as-input-large"
                    :is-rounded="true" :disabled="!valid" @dblclick.prevent />
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none" :is-rounded="true"
                    button-text="ログインに戻る" @click="onBackClick" />
            </div>
        </Form>
        <Loading :is-loading="isLoading" />
        <BaseNotification v-if="successNotification" :message="successNotification.message" :content="successNotification.content" :show="true" />
    </div>
</template>

<style lang="scss" scoped>
Form {
    display: flex;
    flex-flow: column;
    align-items: center;

    .field {
        margin-bottom: 1%;
    }

    .buttons {
        @include vertical-centered-flex;
        gap: 40px;
    }
}
</style>
