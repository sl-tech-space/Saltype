<script setup lang="ts">
import BaseCard from '~/components/molecules/common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import ContactForm from '~/components/molecules/contact/ContactForm.vue';
</script>

<template>
    <div class="contact-card">
        <BaseCard width="large" height="xl" :footer-sep="false" :is-footer="false">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="要望内容を入力してください" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <ContactForm />
                </div>
            </template>
        </BaseCard>
    </div>
</template>

<style lang="scss" scoped>
.contact-card {
    width: 100%;
    height: 75vh;
    @include horizontal-centered-flex;
}
</style>