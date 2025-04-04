<script setup lang="ts">
import Input from "~/components/atoms/inputs/Input.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Image from "~/components/atoms/imgs/Image.vue";
import Field from "~/components/molecules/common/ValidateField.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import { useLogin } from "~/composables/auth/useLogin";
import EyeRegular from "~/assets/images/login/eye-regular.svg";
import EyeSlashRegular from "~/assets/images/login/eye-slash-regular.svg";
import { useErrorNotification } from "~/composables/common/useError";

const eyeRegular = ref(EyeRegular);
const eyeSlashRegular = ref(EyeSlashRegular);
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const showNotification = ref(false);

const route = useRoute();
const { login, isLoading, error } = useLogin()
const { showErrorNotification } = useErrorNotification(error);

/**
 * パスワードの可視・不可視を操作
 */
const passVisibility = () => {
  showPassword.value = !showPassword.value;
};

/**
 * バリデーションの設定
 */
const validationSchema = yup.object().shape({
  email: yup.string().required().email().max(256).label("メールアドレス"),
  password: yup.string()
    .required()
    .min(8)
    .max(100)
    .matches(/[A-Z]/, "大文字を1文字以上含める必要があります")
    .matches(/[0-9]/, "数字を1文字以上含める必要があります") 
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "記号を1文字以上含める必要があります")
    .label("パスワード"),
});

/**
 * ログイン送信処理
 */
const handleSubmit = async () => {
  await login(email.value, password.value);
};

/**
 * ログアウト時の動作
 */
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
          :is-rounded="true" />
      </template>
    </Field>

    <Field v-model="password" name="password" class="field">
      <template #input="{ field }">
        <span>
          <Input :type="showPassword ? 'text' : 'password'" id="password" v-bind="field" placeholder="&nbsp;パスワード"
            border="main-color" width="large" :is-rounded="true" />
          <Image v-if="showPassword" :image-src="eyeSlashRegular" alt="パスワード表示用アイコン" title="パスワード表示" width="mini" height="mini" class="eye"
            @click="passVisibility" />
          <Image v-else :image-src="eyeRegular" alt="パスワード非表示用アイコン" title="パスワード非表示" width="mini" height="mini" class="eye"
            @click="passVisibility" />
        </span>
      </template>
    </Field>

    <!-- パスワード忘れた場合のリンク -->
    <div class="forgot-password">
      <NuxtLink to="/settings/user/password/forgot">パスワードをお忘れですか？</NuxtLink>
    </div>

    <div class="buttons">
      <Button type="reset" button-text="リセット" border="main-color" :is-rounded="true" />
      <Button type="submit" button-text="ログイン" border="main-color" :is-rounded="true" :disabled="!valid" @dblclick.prevent />
    </div>
  </Form>
  <Loading :is-loading="isLoading" />
  <BaseNotification message="ログアウトしました" content="また来てね！" :show="showNotification" />
  <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
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

  .forgot-password {
    width: 100%;
    text-align: center;
    margin-bottom: 1%;

    a {
      font-size: 1em;
      color: $main-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .buttons {
    width: 30%;
    display: flex;
    justify-content: space-around;
  }
}
</style>
