<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import BaseNotification from '../../common/BaseNotification.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Field from '../../common/ValidateField.vue';
import { Form } from 'vee-validate';
import * as yup from "yup";
import EyeRegular from "~/assets/images/login/eye-regular.svg";
import EyeSlashRegular from "~/assets/images/login/eye-slash-regular.svg";
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Image from '~/components/atoms/imgs/Image.vue';
import { useUser } from '~/composables/common/useUser';

const props = defineProps({
    userId: String,
    userName: String,
    email: String,
    passwordExists: Boolean
});

const eyeRegular = ref(EyeRegular);
const eyeSlashRegular = ref(EyeSlashRegular);
const oldPassword = ref("");
const newPassword = ref("");
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const passwordLength = ref(0);
const message = ref('');
const showNotification = ref(false);
const { updateUserInfo } = useUser();
const emit = defineEmits(['user-updated']);

const togglePasswordVisibility = (field: 'old' | 'new') => {
    if (field === 'old') {
        showOldPassword.value = !showOldPassword.value;
    } else {
        showNewPassword.value = !showNewPassword.value;
    }
};

const validationSchema = computed(() => {
    if (props.passwordExists) {
        return yup.object().shape({
            oldPassword: yup.string().required().min(8).max(100).label("現在のパスワード"),
            newPassword: yup.string().required().min(8).max(100).label("新しいパスワード"),
        });
    } else {
        return yup.object().shape({
            newPassword: yup.string().required().min(8).max(100).label("新しいパスワード"),
        });
    }
});

const handleSubmit = async () => {
    showNotification.value = false;
    message.value = await updateUserInfo({
        userId: props.userId!,
        password: oldPassword.value,
        newPassword: newPassword.value,
        googleLoginFlg: !props.passwordExists
    });
    passwordLength.value = newPassword.value.length;
    showNotification.value = true;
    emit('user-updated');
};
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl" :footer-sep="false">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="パスワード変更" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
                        <Field v-if="props.passwordExists" v-model="oldPassword" name="oldPassword" class="field">
                            <template #input="{ field }">
                                <span>
                                    <Input :type="showOldPassword ? 'text' : 'password'" id="oldPassword" v-bind="field"
                                        placeholder="&nbsp;現在のパスワード" border="main-color" width="large"
                                        :is-rounded="true" />
                                    <Image v-if="showOldPassword" :image-src="eyeSlashRegular" alt="パスワード表示用アイコン"
                                        title="パスワード表示" width="mini" height="mini" class="eye"
                                        @click="togglePasswordVisibility('old')" />
                                    <Image v-else :image-src="eyeRegular" alt="パスワード非表示用アイコン" title="パスワード非表示"
                                        width="mini" height="mini" class="eye"
                                        @click="togglePasswordVisibility('old')" />
                                </span>
                            </template>
                        </Field>
                        <Text v-else size="large" text="現在のパスワード&nbsp;:&nbsp;未設定" class="password-none" />
                        <Field v-model="newPassword" name="newPassword" class="field">
                            <template #input="{ field }">
                                <span>
                                    <Input :type="showNewPassword ? 'text' : 'password'" id="newPassword" v-bind="field"
                                        placeholder="&nbsp;新しいパスワード" border="main-color" width="large"
                                        :is-rounded="true" />
                                    <Image v-if="showNewPassword" :image-src="eyeSlashRegular" alt="パスワード表示用アイコン"
                                        title="パスワード表示" width="mini" height="mini" class="eye"
                                        @click="togglePasswordVisibility('new')" />
                                    <Image v-else :image-src="eyeRegular" alt="パスワード非表示用アイコン" title="パスワード非表示"
                                        width="mini" height="mini" class="eye"
                                        @click="togglePasswordVisibility('new')" />
                                </span>
                            </template>
                        </Field>
                        <div class="buttons">
                            <Button type="reset" button-text="リセット" border="main-color" :is-rounded="true" />
                            <Button type="submit" button-text="送信" border="main-color" :is-rounded="true"
                                :disabled="!valid" @click="handleSubmit" @dblclick.prevent />
                        </div>
                    </Form>
                </div>
            </template>
        </BaseCard>
        <BaseNotification :message="message" :content="`パスワード：${passwordLength}桁`" :show="showNotification" />
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

.password-none {
    margin-bottom: 5%;
}
</style>