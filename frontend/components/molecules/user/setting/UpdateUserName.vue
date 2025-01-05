<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import BaseNotification from '../../common/BaseNotification.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import Field from '../../common/ValidateField.vue';
import Title from '~/components/atoms/texts/Title.vue';
import { useUser } from '~/composables/user/useUser';
import { Form } from 'vee-validate';
import * as yup from "yup";

const props = defineProps({
    userId: String,
    userName: String,
    email: String,
    passwordExists: Boolean
});

const name = ref("");
const message = ref('');
const showNotification = ref(false);
const { updateUserInfo } = useUser();
const emit = defineEmits(['user-updated']);

const validationSchema = yup.object().shape({
    name: yup.string().required().max(100).label("ユーザ名"),
});

const handleSubmit = async () => {
    showNotification.value = false;
    message.value = await updateUserInfo({ userId: props.userId!, userName: name.value });
    showNotification.value = true;
    emit('user-updated');
};
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl" :footer-sep="false">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="ユーザ名変更" class="card-text" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
                        <Text size="large">
                            現在のユーザ名&nbsp;:&nbsp;{{ props.userName }}
                        </Text>
                        <Field v-model="name" name="name" class="field">
                            <template #input="{ field }">
                                <Input type="text" id="text" v-bind="field" placeholder="&nbsp;新しいユーザ名"
                                    border="main-color" width="large" :is-rounded="true" />
                            </template>
                        </Field>
                        <div class="buttons">
                            <Button type="reset" button-text="リセット" border="main-color" :is-rounded="true" />
                            <Button type="submit" button-text="送信" border="main-color" :is-rounded="true"
                                :disabled="!valid" @click="handleSubmit" />
                        </div>
                    </Form>
                </div>
            </template>
        </BaseCard>
        <BaseNotification :message="message" :content="`ユーザ名：${name}`" :show="showNotification" />
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
            margin-top: 3%;
            margin-bottom: 30px;
        }

        .buttons {
            width: 60%;
            display: flex;
            justify-content: space-around;
        }
    }
}
</style>