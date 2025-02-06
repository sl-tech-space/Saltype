<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseModal from '../common/BaseModal.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLogout } from '~/composables/auth/useLogout';
import ColorCustomizer from './ColorCustomizer.vue';
import { useColorStore } from '~/store/colorStore';
import { useMenuItems } from '~/composables/common/useMenuItems';
import { useUser } from '~/composables/common/useUser';

const { logout } = await useLogout();
const { colorStore } = useColorStore();
const { checkAdminPermission, isAdmin } = useUser();
const showModal = ref(false);

const navigateToRoute = async (routeName: string) => {
    await navigateTo({ name: routeName });
};

const navigateToRanking = () => navigateToRoute("ranking");
const navigateToAnalyze = () => navigateToRoute("analyze");
const navigateToContact = () => navigateToRoute("contact");
const navigateToUserSetting = () => navigateToRoute("settings-user");
const navigateToUserAdmin = () => navigateToRoute("admin");

const showColorCustomizer = () => {
    showModal.value = !showModal.value;
};

const handleLogout = async () => {
    await logout();
};

const menuItems = ref(useMenuItems({
    navigateToRanking,
    navigateToAnalyze,
    navigateToContact,
    showColorCustomizer,
    navigateToUserSetting,
    navigateToUserAdmin
}, isAdmin.value));

watchEffect(() => {
    menuItems.value = useMenuItems({
        navigateToRanking,
        navigateToAnalyze,
        navigateToContact,
        showColorCustomizer,
        navigateToUserSetting,
        navigateToUserAdmin
    }, isAdmin.value);
});

const homeMenuItems = computed(() => menuItems.value.homeMenuItems);
const getAction = computed(() => menuItems.value.getAction);

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
                    <Text v-for="item in homeMenuItems" :key="item.text" size="large"
                        @click="() => getAction(item.actionKey)?.()">
                        <ClientOnly>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                :fill="colorStore.mainColor">
                                <path :d="item.path" />
                            </svg>
                        </ClientOnly>
                        {{ item.text }}
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
        height: 100%;
        @include horizontal-flex;

        .menu-list {
            height: 100%;
            @include vertical-flex;
            justify-content: space-around;
            list-style-type: none;

            p {
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