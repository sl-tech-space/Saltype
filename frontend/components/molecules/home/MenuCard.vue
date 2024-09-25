<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLogout } from '~/composables/auth/useLogout';
import Loading from '~/composables/ui/Loading.vue';
import { useRouter } from '#app';
import { useSession } from '~/composables/server/useSession';

const { logout } = await useLogout();
const router = useRouter();
const { isLoading, checkSession } = useSession();

const navigateToRanking = async () => {
    const isSessionValid = await checkSession(true);
    if (!isSessionValid) return;

    router.push({ name: "ranking" });
}

const navigateToAnalyze = async () => {
    const isSessionValid = await checkSession(true);
    if (!isSessionValid) return;

    router.push({ name: "analyze" });
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
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="M480-160q75 0 127.5-52.5T660-340q0-75-52.5-127.5T480-520q-75 0-127.5 52.5T300-340q0 75 52.5 127.5T480-160ZM363-572q20-11 42.5-17.5T451-598L350-800H250l113 228Zm234 0 114-228H610l-85 170 19 38q14 4 27 8.5t26 11.5ZM256-208q-17-29-26.5-62.5T220-340q0-36 9.5-69.5T256-472q-42 14-69 49.5T160-340q0 47 27 82.5t69 49.5Zm448 0q42-14 69-49.5t27-82.5q0-47-27-82.5T704-472q17 29 26.5 62.5T740-340q0 36-9.5 69.5T704-208ZM480-80q-40 0-76.5-11.5T336-123q-9 2-18 2.5t-19 .5q-91 0-155-64T80-339q0-87 58-149t143-69L120-880h280l80 160 80-160h280L680-559q85 8 142.5 70T880-340q0 92-64 156t-156 64q-9 0-18.5-.5T623-123q-31 20-67 31.5T480-80Zm0-260ZM363-572 250-800l113 228Zm234 0 114-228-114 228ZM406-230l28-91-74-53h91l29-96 29 96h91l-74 53 28 91-74-56-74 56Z" />
                            </svg>
                            ランキング
                        </Text>
                    </li>
                    <li>
                        <Text size="large" @click="navigateToAnalyze">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z" />
                            </svg>
                            分析情報
                        </Text>
                    </li>
                    <li>
                        <Text size="large">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="m720-160-56-56 63-64H560v-80h167l-63-64 56-56 160 160-160 160ZM160-280q-33 0-56.5-23.5T80-360v-400q0-33 23.5-56.5T160-840h520q33 0 56.5 23.5T760-760v204q-10-2-20-3t-20-1q-10 0-20 .5t-20 2.5v-147L416-520 160-703v343h323q-2 10-2.5 20t-.5 20q0 10 1 20t3 20H160Zm58-480 198 142 204-142H218Zm-58 400v-400 400Z" />
                            </svg>
                            ご要望
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
    <Loading :is-loading="isLoading" />
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

                &:hover {
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
</style>