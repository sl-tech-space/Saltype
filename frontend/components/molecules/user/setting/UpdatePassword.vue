<script setup lang="ts">
import { ref } from 'vue';
import BaseCard from '../../common/BaseCard.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Field from '../../common/ValidateField.vue';
import { Form } from 'vee-validate';
import * as yup from "yup";
import EyeRegular from "~/assets/images/login/eye-regular.svg";
import EyeSlashRegular from "~/assets/images/login/eye-slash-regular.svg";
import Title from '~/components/atoms/texts/Title.vue';
import Image from '~/components/atoms/imgs/Image.vue';

const eyeRegular = ref(EyeRegular);
const eyeSlashRegular = ref(EyeSlashRegular);
const oldPassword = ref("");
const newPassword = ref("");
const showOldPassword = ref(false);
const showNewPassword = ref(false);

const togglePasswordVisibility = (field: 'old' | 'new') => {
    if (field === 'old') {
        showOldPassword.value = !showOldPassword.value;
    } else {
        showNewPassword.value = !showNewPassword.value;
    }
};

const validationSchema = yup.object().shape({
    oldPassword: yup.string().required().min(8).label("現在のパスワード"),
    newPassword: yup.string().required().min(8).label("新しいパスワード"),
});

const handleSubmit = async () => {
    // 送信処理
};
</script>

<template>
    <BaseCard width="xl" height="xl" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="パスワード変更" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
                    <Field v-model="oldPassword" name="oldPassword" class="field">
                        <template #input="{ field }">
                            <span>
                                <Input :type="showOldPassword ? 'text' : 'password'" id="oldPassword" v-bind="field"
                                    placeholder="&nbsp;現在のパスワード" border="main-color" width="large" :rounded="true" />
                                <Image v-if="showOldPassword" :image-src="eyeSlashRegular" alt="パスワード表示" width="mini"
                                    height="mini" class="eye" @click="togglePasswordVisibility('old')" />
                                <Image v-else :image-src="eyeRegular" alt="パスワード非表示" width="mini" height="mini"
                                    class="eye" @click="togglePasswordVisibility('old')" />
                            </span>
                        </template>
                    </Field>
                    <Field v-model="newPassword" name="newPassword" class="field">
                        <template #input="{ field }">
                            <span>
                                <Input :type="showNewPassword ? 'text' : 'password'" id="newPassword" v-bind="field"
                                    placeholder="&nbsp;新しいパスワード" border="main-color" width="large" :rounded="true" />
                                <Image v-if="showNewPassword" :image-src="eyeSlashRegular" alt="パスワード表示" width="mini"
                                    height="mini" class="eye" @click="togglePasswordVisibility('new')" />
                                <Image v-else :image-src="eyeRegular" alt="パスワード非表示" width="mini" height="mini"
                                    class="eye" @click="togglePasswordVisibility('new')" />
                            </span>
                        </template>
                    </Field>
                    <div class="buttons">
                        <Button type="reset" button-text="リセット" border="main-color" :rounded="true" />
                        <Button type="submit" button-text="送信" border="main-color" :rounded="true" :disabled="!valid" />
                    </div>
                </Form>
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.header-content {
    margin-left: 4%;
}

.body-content {
    width: 100%;
    height: 100%;
    @include vertical-centered-flex;

    Form {
        width: 100%;
        @include vertical-flex;
        align-items: center;

        .field {
            @include vertical-flex;
            align-items: center;
            margin-bottom: 30px;

            .eye {
                position: absolute;
                transform: translate(-130%, 20%);
            }
        }

        .buttons {
            width: 60%;
            display: flex;
            justify-content: space-around;
        }
    }
}
</style>