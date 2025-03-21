<script setup lang="ts">
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import { useLocalStorage } from '~/composables/common/useLocalStorage';

// クライアントサイドでのみレンダリングするための状態
const mounted = ref(false);
const { value: consent, setValue } = useLocalStorage('cookie-consent');

const acceptCookies = () => {
    setValue('accepted');
};

// コンポーネントがマウントされた後にのみレンダリング
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <ClientOnly>
        <template v-if="mounted && consent !== 'accepted'">
            <div class="overlay">
                <div class="cookie-banner">
                    <Text size="large" color="white">
                        当サイトではクッキーを使用しています。
                        認証機能を利用するためには同意が必要です。<br>
                        クッキーについての詳細をご希望の場合は当サイトのクッキーポリシーをご覧ください。
                    </Text>
                    <div class="cookie-banner-actions">
                        <div class="cookie-banner-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Zm-60-480q25 0 42.5-17.5T480-620q0-25-17.5-42.5T420-680q-25 0-42.5 17.5T360-620q0 25 17.5 42.5T420-560Zm-80 200q25 0 42.5-17.5T400-420q0-25-17.5-42.5T340-480q-25 0-42.5 17.5T280-420q0 25 17.5 42.5T340-360Zm260 40q17 0 28.5-11.5T640-360q0-17-11.5-28.5T600-400q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320ZM480-160q122 0 216.5-84T800-458q-50-22-78.5-60T683-603q-77-11-132-66t-68-132q-80-2-140.5 29t-101 79.5Q201-644 180.5-587T160-480q0 133 93.5 226.5T480-160Zm0-324Z" />
                            </svg>
                            <NuxtLink to="/cookiepolicy">クッキーポリシー</NuxtLink>
                        </div>
                        <Button type="button" button-text="同意する" color="white" border="main-color" width="large"
                            background="black" :is-rounded="true" @click="acceptCookies" />
                    </div>
                </div>
            </div>
        </template>
    </ClientOnly>
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

    &-actions {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    &-link {
        display: flex;
        gap: 5px;
        align-items: center;
        color: $main-color;
        font-size: 1.2rem;
    }
}
</style>
