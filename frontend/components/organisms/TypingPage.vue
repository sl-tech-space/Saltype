<script setup lang="ts">
import CursorEffect from "~/composables/ui/CursorEffect.vue";
import TypingHeader from "../molecules/typing/TypingHeader.vue";
import { useSession } from "~/composables/server/useSession";
import TypingScreen from "../molecules/typing/TypingScreen.vue";

const { getSession } = useSession()

onMounted(() => {
  getSession()
})
</script>

<template>
  <CursorEffect />
  <div class="typing-page">
    <TypingHeader />
    <TypingScreen />
  </div>
</template>

<style lang="scss" src="@/assets/styles/components/organisms/typing-page.scss" />