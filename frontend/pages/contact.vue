<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import ContactHeader from '~/components/organisms/contact/ContactHeader.vue';
import ContactCard from '~/components/organisms/contact/ContactCard.vue';

onMounted(() => {
  useHead({
    title: "ご要望 | Saltype"
  })
})
</script>

<template>
  <CursorEffect />
  <div class="page">
    <ContactHeader />
    <ContactCard />
  </div>
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
