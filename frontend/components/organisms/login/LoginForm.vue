<script setup lang="ts">
import Input from "~/components/atoms/inputs/Input.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Image from "~/components/atoms/imgs/Image.vue";
import Field from "~/components/molecules/common/ValidateField.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import { useLogin } from "~/composables/auth/useLogin";
import EyeRegular from "~/assets/images/login/eye-regular.svg";
import EyeSlashRegular from "~/assets/images/login/eye-slash-regular.svg";

const eyeRegular = ref(EyeRegular);
const eyeSlashRegular = ref(EyeSlashRegular);
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const passVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validationSchema = yup.object().shape({
  email: yup.string().required().email().label("メールアドレス"),
  password: yup.string().required().min(8).label("パスワード"),
});

const { login } = await useLogin()

const handleSubmit = async () => {
  await login(email.value, password.value);
};

const route = useRoute();
const showNotification = ref(false);

const handleLogout = () => {
  showNotification.value = true;
}

onMounted(() => {
  showNotification.value = false;
  if (route.query.reason === 'logout') {
    handleLogout();
  }
});
</script>

<template>
  <Form :validation-schema="validationSchema" v-slot="{ meta: { valid } }" @submit="handleSubmit">
    <Field v-model="email" name="email" class="field">
      <template #input="{ field }">
        <Input type="email" id="email" v-bind="field" placeholder="&nbsp;メールアドレス" border="main-color" width="large"
          :rounded="true" />
      </template>
    </Field>

    <Field v-model="password" name="password" class="field">
      <template #input="{ field }">
        <span>
          <Input :type="showPassword ? 'text' : 'password'" id="password" v-bind="field" placeholder="&nbsp;パスワード"
            border="main-color" width="large" :rounded="true" />
          <Image v-if="showPassword" :image-src="eyeSlashRegular" alt="パスワード表示" width="mini" height="mini" class="eye"
            @click="passVisibility" />
          <Image v-else :image-src="eyeRegular" alt="パスワード非表示" width="mini" height="mini" class="eye"
            @click="passVisibility" />
        </span>
      </template>
    </Field>

    <div class="buttons">
      <Button type="reset" button-text="リセット" border="main-color" :rounded="true" />
      <Button type="submit" button-text="ログイン" border="main-color" :rounded="true" :disabled="!valid" />
    </div>
  </Form>
  <BaseNotification message="ログアウトしました" content="また来てね！" :show="showNotification" />
</template>

<style lang="scss" scoped>
Form {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;

  .field {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 30px;

    .eye {
      position: absolute;

      transform: translate(-130%, 20%);
    }
  }

  .buttons {
    width: 30%;
    display: flex;
    justify-content: space-around;
  }
}
</style>
