<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseModal from '../common/BaseModal.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLogout } from '~/composables/auth/useLogout';
import { useRouter } from '#app';
import ColorCustomizer from './ColorCustomizer.vue';
import { useColorStore } from '~/store/colorStore';

const { logout } = await useLogout();
const { colorStore } = useColorStore();
const router = useRouter();
const showModal = ref(false);

const navigateToRoute = async (routeName: string) => {
    router.push({ name: routeName });
};

const navigateToRanking = () => navigateToRoute("ranking");
const navigateToAnalyze = () => navigateToRoute("analyze");
const navigateToContact = () => navigateToRoute("contact");

const showColorCustomizer = () => {
    showModal.value = !showModal.value;
};

const handleLogout = async () => {
    await logout();
};
</script>

<template>
    <BaseCard width="large" height="xl" class="menu-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="メニュー" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <ul class="menu-list">
                    <li>
                        <Text size="large" @click="navigateToRanking">
                            <ClientOnly>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" :fill="colorStore.mainColor">
                                    <path
                                        d="M480-160q75 0 127.5-52.5T660-340q0-75-52.5-127.5T480-520q-75 0-127.5 52.5T300-340q0 75 52.5 127.5T480-160ZM363-572q20-11 42.5-17.5T451-598L350-800H250l113 228Zm234 0 114-228H610l-85 170 19 38q14 4 27 8.5t26 11.5ZM256-208q-17-29-26.5-62.5T220-340q0-36 9.5-69.5T256-472q-42 14-69 49.5T160-340q0 47 27 82.5t69 49.5Zm448 0q42-14 69-49.5t27-82.5q0-47-27-82.5T704-472q17 29 26.5 62.5T740-340q0 36-9.5 69.5T704-208ZM480-80q-40 0-76.5-11.5T336-123q-9 2-18 2.5t-19 .5q-91 0-155-64T80-339q0-87 58-149t143-69L120-880h280l80 160 80-160h280L680-559q85 8 142.5 70T880-340q0 92-64 156t-156 64q-9 0-18.5-.5T623-123q-31 20-67 31.5T480-80Zm0-260ZM363-572 250-800l113 228Zm234 0 114-228-114 228ZM406-230l28-91-74-53h91l29-96 29 96h91l-74 53 28 91-74-56-74 56Z" />
                                </svg>
                            </ClientOnly>
                            ランキング
                        </Text>
                    </li>
                    <li>
                        <Text size="large" @click="navigateToAnalyze">
                            <ClientOnly>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" :fill="colorStore.mainColor">
                                    <path
                                        d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z" />
                                </svg>
                            </ClientOnly>
                            分析情報
                        </Text>
                    </li>
                    <li>
                        <Text size="large" @click="navigateToContact">
                            <ClientOnly>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" :fill="colorStore.mainColor">
                                    <path
                                        d="m720-160-56-56 63-64H560v-80h167l-63-64 56-56 160 160-160 160ZM160-280q-33 0-56.5-23.5T80-360v-400q0-33 23.5-56.5T160-840h520q33 0 56.5 23.5T760-760v204q-10-2-20-3t-20-1q-10 0-20 .5t-20 2.5v-147L416-520 160-703v343h323q-2 10-2.5 20t-.5 20q0 10 1 20t3 20H160Zm58-480 198 142 204-142H218Zm-58 400v-400 400Z" />
                                </svg>
                            </ClientOnly>
                            ご要望
                        </Text>
                    </li>
                    <li>
                        <Text size="large" @click="showColorCustomizer">
                            <ClientOnly>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" :fill="colorStore.mainColor">
                                    <path
                                        d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z" />
                                </svg>
                            </ClientOnly>
                            カスタマイズ
                        </Text>
                    </li>
                    <!-- <li><Text size="large" text="パスワード設定" /></li> -->
                </ul>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="large" height="large" background="none" :rounded="true"
                    button-text="ログアウト" @click="handleLogout" />
            </div>
        </template>
    </BaseCard>
    <BaseModal v-model="showModal">
        <template #modal-header>
            <Title size="small" color="main-color" text="カスタマイズパレット" />
        </template>
        <template #modal-body>
            <ColorCustomizer />
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
.menu-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        @include horizontal-flex;

        .menu-list {
            margin-top: 10%;

            li {
                margin-top: 10%;
                list-style-type: none;

                p:hover {
                    color: $hover-color;
                    cursor: pointer;
                }
            }
        }
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
}

.color-customizer {
    position: fixed;
    right: 0;
    top: 0;
    width: 300px;
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}
</style>