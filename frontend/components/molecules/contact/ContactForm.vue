<script setup lang="ts">
import Textarea from '~/components/atoms/inputs/Textarea.vue';
import Field from '../common/ValidateField.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Loading from '~/components/molecules/common/ui/Loading.vue';
import BaseNotification from '../common/BaseNotification.vue';
import { useContact } from '~/composables/contact/useContact';
import { Form } from 'vee-validate';
import * as yup from "yup";

const contact = ref("");
const { isLoading, sendContentToServer } = useContact();
const showNotification = ref(false);
const message = ref("");

const validationSchema = yup.object().shape({
    contact: yup.string().required().max(300).label("要望内容")
});

const handleSubmit = async () => {
    showNotification.value = false;
    message.value = await sendContentToServer(contact.value);
    showNotification.value = true;
};
</script>

<template>
    <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
        <Field v-model="contact" name="contact" class="field">
            <template #input="{ field }">
                <Textarea id="contact" v-bind="field" placeholder="&nbsp;要望内容" border="main-color" width="large"
                    :is-rounded="true" class="textarea" />
            </template>
        </Field>

        <div class="buttons">
            <Button type="reset" button-text="リセット" border="main-color" :is-rounded="true" />
            <Button type="submit" button-text="送信" border="main-color" :is-rounded="true" :disabled="!valid" />
        </div>
    </Form>
    <Loading :is-loading="isLoading" />
    <BaseNotification :message="message" :content="`送信内容 : ${contact}`" :show="showNotification" />
</template>

<style lang="scss" scoped>
Form {
    .field {
        width: 100%;
        height: 100%;

        .textarea {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-top: 5%;
            width: 80%;
            height: 20vh;
        }
    }

    .buttons {
        width: 100%;
        margin-top: 2%;
        display: flex;
        justify-content: space-around;
    }
}
</style>