<script setup lang="ts">
import { useRouter } from "vue-router";
import LoginPage from "~/components/organisms/LoginPage.vue";
import { getToken, isTokenAvailable } from "~/composables/token";

const router = useRouter();

async function initialize() {
  if (isTokenAvailable() && getToken()) {
    const token = getToken();
    const response = await fetch("http://localhost:8000/api/auth-token/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.userName);
      router.push({ name: "home" });
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("ログインに失敗しました。");
    }
  }
}

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="login-page">
    <LoginPage />
  </div>
</template>

<style lang="scss" src="@/assets/styles/pages/index.scss" />
