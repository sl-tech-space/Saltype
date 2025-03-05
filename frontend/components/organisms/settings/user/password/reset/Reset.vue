<script setup lang="ts">
import Describe from '~/components/molecules/settings/user/password/Describe.vue';
import ResetForm from '~/components/molecules/settings/user/password/reset/ResetForm.vue';

interface Props {
  token: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <Describe title="パスワードリセット" description="パスワードを再設定します。<br>新しいパスワードを入力してください。" />
    <ResetForm :token="props.token" />
  </div>
</template>
