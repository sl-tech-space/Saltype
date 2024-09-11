<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue';

useHead({
  title: "Welcome"
});
</script>

<template>
  <Title color="dark-blue" text="Welcome" class="title" />
</template>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as var;

.title {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var.$black;
}
</style>