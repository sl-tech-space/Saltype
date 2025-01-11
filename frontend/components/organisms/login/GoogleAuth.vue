<script setup lang="ts">
import Separator from "~/components/atoms/ui/Separator.vue";
import Text from "~/components/atoms/texts/Text.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Image from "~/components/atoms/imgs/Image.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import GoogleIcon from "~/assets/images/login/web_dark_rd_na@2x.png";
import { useGoogleAuth } from "~/composables/auth/useGoogleAuth";

const googleIcon = ref(GoogleIcon);
const config = useRuntimeConfig();
const showErrorNotification = ref(false);

const { loginWithGoogle, isLoading, error } = useGoogleAuth();
const handleLoginWithGoogle = async (): Promise<void> => {
  await loginWithGoogle();
}

watch(error, (newError) => {
  if (newError) {
    showErrorNotification.value = true;
  }
});

onMounted(() => {
  nextTick(() => {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: loginWithGoogle
      });
    }
  });
})
</script>

<template>
  <div class="sep">
    <Separator color="sub-color" width="small" margin="vertical" />
    <span class="center-text">
      <Text text="&nbsp;または&nbsp;" />
    </span>
    <Separator color="sub-color" width="small" margin="vertical" />
  </div>
  <div class="google-auth">
    <Button border="sub-color" width="same-as-input-large" height="large" :is-rounded="true"
      @click="handleLoginWithGoogle()" @dblclick.prevent class="auth-button">
      <template #any>
        <Image :image-src="googleIcon" alt="google-icon" width="mini" height="mini" />
        Googleで認証
      </template>
    </Button>
  </div>
  <Loading :is-loading="isLoading" />
  <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
</template>

<style lang="scss" scoped>
.sep {
  display: flex;
  justify-content: center;
  text-align: center;

  .center-text {
    align-self: center;
  }
}

.google-auth {
  display: flex;
  justify-content: center;

  .auth-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>