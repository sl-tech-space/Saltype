<script setup lang="ts">
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import ContactHeader from '~/components/organisms/contact/ContactHeader.vue';
import ContactCard from '~/components/organisms/contact/ContactCard.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';

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
  <CopyRight />
</template>

<style lang="scss" scoped>
.page {
  @extend %full-page;
}
</style>
