<script setup lang="ts">
import Field from '~/components/molecules/common/ValidateField.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Image from '~/components/atoms/imgs/Image.vue';
import BaseNotification from '~/components/molecules/common/BaseNotification.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import { Form } from "vee-validate";
import * as yup from "yup";
import { usePasswordReset } from '~/composables/settings/usePasswordReset';
import EyeRegular from "~/assets/images/login/eye-regular.svg";
import EyeSlashRegular from "~/assets/images/login/eye-slash-regular.svg";

interface Props {
    token: string;
}

const props = defineProps<Props>();

const eyeRegular = ref(EyeRegular);
const eyeSlashRegular = ref(EyeSlashRegular);
const password = ref("");
const passwordConfirm = ref("");
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const { resetPassword, isLoading, successNotification, errorNotification } = usePasswordReset();

const togglePasswordVisibility = (field: 'password' | 'passwordConfirm') => {
    if (field === 'password') {
        showPassword.value = !showPassword.value;
    } else {
        showPasswordConfirm.value = !showPasswordConfirm.value;
    }
};

/**
 * バリデーションの設定
 */
const validationSchema = yup.object().shape({
    password: yup.string().required().min(8).max(100).matches(/[A-Z]/, "大文字を1文字以上含める必要があります").matches(/[0-9]/, "数字を1文字以上含める必要があります").matches(/[!@#$%^&*(),.?":{}|<>]/, "記号を1文字以上含める必要があります").label("パスワード"),
    passwordConfirm: yup.string().required().oneOf([yup.ref("password")], "パスワードが一致しません").label("パスワード確認"),
});

const onBackClick = async () => {
    await navigateTo({ name: "login" });
}

const handleSubmit = async () => {
    await resetPassword(props.token, password.value);
    password.value = "";
    passwordConfirm.value = "";
}
</script>

<template>
    <div>
        <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
            <Field v-model="password" name="password" class="field">
                <template #input="{ field }">
                    <span>
                        <Input :type="showPassword ? 'text' : 'password'" id="password" v-bind="field"
                            placeholder="&nbsp;パスワード" border="main-color" width="large" :is-rounded="true" />
                        <Image v-if="showPassword" :image-src="eyeSlashRegular" alt="パスワード表示用アイコン" title="パスワード表示"
                            width="mini" height="mini" class="eye" @click="togglePasswordVisibility('password')" />
                        <Image v-else :image-src="eyeRegular" alt="パスワード非表示用アイコン" title="パスワード非表示" width="mini"
                            height="mini" class="eye" @click="togglePasswordVisibility('password')" />
                    </span>
                </template>
            </Field>
            <Field v-model="passwordConfirm" name="passwordConfirm" class="field">
                <template #input="{ field }">
                    <span>
                        <Input :type="showPasswordConfirm ? 'text' : 'password'" id="passwordConfirm" v-bind="field"
                            placeholder="&nbsp;パスワード確認" border="main-color" width="large" :is-rounded="true" />
                        <Image v-if="showPasswordConfirm" :image-src="eyeSlashRegular" alt="パスワード表示用アイコン"
                            title="パスワード表示" width="mini" height="mini" class="eye"
                            @click="togglePasswordVisibility('passwordConfirm')" />
                        <Image v-else :image-src="eyeRegular" alt="パスワード非表示用アイコン" title="パスワード非表示" width="mini"
                            height="mini" class="eye" @click="togglePasswordVisibility('passwordConfirm')" />
                    </span>
                </template>
            </Field>

            <div class="buttons">
                <Button type="submit" button-text="パスワードを変更" border="main-color" width="same-as-input-large"
                    :is-rounded="true" :disabled="!valid" @dblclick.prevent />
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none"
                    :is-rounded="true" button-text="ログインに戻る" @click="onBackClick" />
            </div>
        </Form>
        <Loading :is-loading="isLoading" />
        <BaseNotification v-if="successNotification" :message="successNotification.message"
            :content="successNotification.content" :show="true" />
        <BaseNotification v-if="errorNotification" :message="errorNotification.message"
            :content="errorNotification.content" :show="true" />
    </div>
</template>

<style lang="scss" scoped>
Form {
    display: flex;
    flex-flow: column;
    align-items: center;

    .field {
        display: flex;
        flex-flow: column;
        align-items: center;
        margin-bottom: 1%;

        .eye {
            position: absolute;
            transform: translate(-130%, 20%);
        }
    }

    .buttons {
        @include vertical-centered-flex;
        gap: 40px;
    }
}
</style>
