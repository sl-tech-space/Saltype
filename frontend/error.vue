<script setup lang="ts">
import Text from './components/atoms/texts/Text.vue';
import Image from './components/atoms/imgs/Image.vue';

const error = useError();

const errorMessages: Record<string, string> = {
  'not found': 'ページが見つかりません',
  'forbidden': 'アクセス権限がありません',
  'internal server error': 'サーバーエラーが発生しました',
  'bad request': 'リクエストが無効です',
  'unauthorized': 'ログインが必要です'
};

const errorTitle = computed(() => {
  if (!error.value) {
    return "エラー | Saltype";
  }

  const errorMessage = error.value.message;
  const defaultMessage = Object.keys(errorMessages).find(key => errorMessage.includes(key)) || "エラー";

  return `${errorMessages[defaultMessage] || defaultMessage} | Saltype`;
});

function navigateToTop() {
  navigateTo("/")
}

useHead({
  title: errorTitle.value,
  link: [{ rel: "icon", type: "image/x-icon", href: "/error.ico" }]
});
</script>

<template>
  <div class="page">
    <div class="container">
      <Image image-src="/error.png" />
      <Text size="large">{{ error?.message }}</Text>
      <button @click="navigateToTop()">トップに戻る</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  color: white;
  background-color: rgb(50, 50, 50);
  overflow: hidden;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    gap: 10px;

    img {
      width: 50%;
      max-width: 50%;
      height: auto;
      max-height: 50%;
    }

    button {
      padding: 5%;
      margin: 5%;
      border-radius: 50%;
      border-color: white;
      color: white;
      background-color: #202020;
    }

    button:hover {
      cursor: pointer;
      border-color: #cffdfd;
      background-color: #353535;
    }
  }
}
</style>