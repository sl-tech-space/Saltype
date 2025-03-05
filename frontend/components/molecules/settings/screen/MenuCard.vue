<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Loading from '../../common/ui/Loading.vue';
import BaseNotification from '../../common/BaseNotification.vue';
import { useColorStore } from '~/store/colorStore';
import { useMenuItems } from '~/composables/common/useMenuItems';
import { useUser } from '~/composables/common/useUser';
import { useErrorNotification } from '~/composables/common/useError';

const { isAdmin, isLoading, error } = useUser();
const { showErrorNotification } = useErrorNotification(error);
const { colorStore } = useColorStore();

const emit = defineEmits(['changeCard']);

const slideToColorCustomizer = () => {
    emit('changeCard', 'colorCustomizer');
}

const slideToTypingScreenSetting = () => {
    emit('changeCard', 'typingScreenSetting');
}

const slideToScreenCommonSetting = () => {
    emit('changeCard', 'screenCommonSetting');
}

const { screenSettingMenuItems, getAction } = useMenuItems({
    slideToColorCustomizer,
    slideToTypingScreenSetting,
    slideToScreenCommonSetting,
}, isAdmin.value)
</script>

<template>
    <BaseCard width="large" height="xl" class="menu-card" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="メニュー" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="menu-list">
                    <Text v-for="item in screenSettingMenuItems" :key="item.text" size="large"
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
    </BaseCard>
    <Loading :is-loading="isLoading" />
    <BaseNotification v-if="error" message="エラーが発生しました" :content="error" :show="showErrorNotification" />
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

                &:hover {
                    color: $hover-color;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>