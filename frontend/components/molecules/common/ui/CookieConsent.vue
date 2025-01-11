<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

const consent = ref<string | null>(null)

onMounted(() => {
    consent.value = localStorage.getItem('cookie-consent')
})

const acceptCookies = () => {
    consent.value = 'accepted'
    localStorage.setItem('cookie-consent', 'accepted')
}
</script>

<template>
    <div>
        <div v-if="consent !== 'accepted'" class="overlay"></div>
        <div v-if="consent !== 'accepted'" class="cookie-banner">
            <Text size="large" color="white">当サイトではクッキーを使用しています。続行することで同意したものとみなされます。</Text>
            <div class="cookie-banner-buttons">
                <RouterLink to="/cookiepolicy">クッキーポリシー</RouterLink>
                <Button type="button" button-text="同意する" color="white" border="main-color" width="large" background="black"
                :is-rounded="true" @click="acceptCookies" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $sub-color;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
}

.cookie-banner-buttons {
    display: flex;
    gap: 20px;
    align-items: center;
}
</style>
