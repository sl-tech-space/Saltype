<script setup lang="ts">
import Separator from "~/components/atoms/ui/Separator.vue";
import Text from "~/components/atoms/texts/Text.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Image from "~/components/atoms/imgs/Image.vue";
import GoogleIcon from "~/assets/images/index/web_dark_rd_na@2x.png";
import { useGoogleAuth } from "~/composables/auth/useGoogleAuth";

const googleIcon = ref(GoogleIcon);

const config = useRuntimeConfig()

const { loginWithGoogle } = useGoogleAuth();

const handleLoginWithGoogle = async (): Promise<void> => {
  try {
    await loginWithGoogle()
  } catch (e) {
    //TODO change
    console.error('Login failed:', e)
  }
}

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
  <div>
    <div class="sep">
      <Separator color="dark-blue" width="small" margin="vertical" />
      <span class="center-text">
        <Text text="&nbsp;または&nbsp;" />
      </span>
      <Separator color="dark-blue" width="small" margin="vertical" />
    </div>
    <div class="google-auth">
      <Button
        @click="handleLoginWithGoogle()"
        button-text="Googleで認証"
        border="dark-blue"
        width="same-as-input-large"
        height="large"
        :rounded="true"
        class="auth-button"
      >
        <template #any>
          <Image
            :image-src="googleIcon"
            alt="google-icon"
            width="mini"
            height="mini"
          />
        </template>
      </Button>
    </div>
  </div>
</template>

<style
  lang="scss"
  src="@/assets/styles/components/molecules/google-auth.scss"
/>
