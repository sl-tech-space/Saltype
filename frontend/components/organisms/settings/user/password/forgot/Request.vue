<script setup lang="ts">
import Describe from '~/components/molecules/settings/user/password/Describe.vue';
import RequestForm from '~/components/molecules/settings/user/password/forgot/RequestForm.vue';
</script>

<template>
    <div>
        <Describe title="ログインできない場合" description="メールアドレスを入力してください。<br>パスワード再設定のリンクをお送りします。" />
        <RequestForm />
    </div>
</template>
