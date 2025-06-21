<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLogout } from '~/composables/auth/useLogout';
import { useColorStore } from '~/store/colorStore';
import { useMenuItems } from '~/composables/common/useMenuItems';
import { useUser } from '~/composables/common/useUser';

const { logout } = await useLogout();
const { colorStore } = useColorStore();
const { checkAdminPermission, isAdmin } = useUser();

const navigateToRoute = async (routeName: string) => {
    await navigateTo({ name: routeName });
};

const navigateToRouteByParams = async (routeName: string, params: string) => {
    await navigateTo({ name: routeName, params: { id: params } });
};

const navigateToRanking = () => navigateToRoute("ranking");
const navigateToAnalyze = () => navigateToRoute("analyze");
const navigateToContact = () => navigateToRoute("contact");
const navigateToScreenSetting = () => navigateToRoute("settings-screen");
const navigateToUserSetting = () => navigateToRoute("settings-user");
const navigateToUserAdmin = () => navigateToRoute("admin");
const navigateToAiTyping = () => navigateToRouteByParams("typing-id", "ai");

const handleLogout = async () => {
    await logout();
};

const menuItems = ref(useMenuItems({
    navigateToRanking,
    navigateToAnalyze,
    navigateToContact,
    navigateToScreenSetting,
    navigateToUserSetting,
    navigateToUserAdmin,
    navigateToAiTyping
}, isAdmin.value));

watchEffect(() => {
    menuItems.value = useMenuItems({
        navigateToRanking,
        navigateToAnalyze,
        navigateToContact,
        navigateToScreenSetting,
        navigateToUserSetting,
        navigateToUserAdmin,
        navigateToAiTyping
    }, isAdmin.value);
});

const homeMenuItems = computed(() => menuItems.value.homeMenuItems);
const getAction = computed(() => menuItems.value.getAction);

const analyzeToolUrl = computed(() => {
    if (import.meta.client) {
        return process.env.NUXT_ENV === 'production'
            ? `https://${window.location.host}/analyze-tool`
            : 'http://localhost:8501';
    }
    return '';
});

onMounted(async () => {
    await checkAdminPermission();
});
</script>

<template>
    <BaseCard width="large" height="xl" class="menu-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="メニュー" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="menu-list">
                    <Text v-for="item in homeMenuItems" :key="item.text" size="large">
                        <ClientOnly>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                :fill="colorStore.mainColor">
                                <path :d="item.path" />
                            </svg>
                        </ClientOnly>
                        <ClientOnly>
                            <a v-if="item.actionKey === 'navigateToAnalyzeTool'" :href="analyzeToolUrl" target="_blank"
                                rel="noopener noreferrer" class="analyze-tool-link">
                                {{ item.text }}
                            </a>
                            <template v-else>
                                <span @click="() => getAction(item.actionKey)?.()">
                                    {{ item.text }}
                                </span>
                            </template>
                        </ClientOnly>
                    </Text>
                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="large" height="large" background="none" :is-rounded="true"
                    button-text="ログアウト" @click="handleLogout" />
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.menu-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        height: 100%;
        @include horizontal-flex;

        .menu-list {
            height: 100%;
            @include vertical-flex;
            justify-content: space-around;
            list-style-type: none;

            p {
                display: flex;
                align-items: center;
                gap: 2px;

                svg {
                    display: flex;
                    align-items: center;
                }

                span,
                a {
                    &:hover {
                        color: $hover-color;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
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

.analyze-tool-link {
    color: inherit;
    text-decoration: none;
}
</style>