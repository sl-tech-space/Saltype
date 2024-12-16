<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Loading from '../../common/ui/Loading.vue';
import BaseNotification from '../../common/BaseNotification.vue';
import { useMenuItems } from '~/composables/common/useMenuItems';
import { useUser } from '~/composables/user/useUser';
import { useErrorNotification } from '~/composables/common/useError';

const { getAllUserInfo, userInfo, isLoading, error } = useUser();
const { showErrorNotification } = useErrorNotification(error);

const emit = defineEmits(['changeCard']);

const slideToUserInfo = () => {
    emit('changeCard', 'userInfo');
}

const slideToUpdateUserName = () => {
    emit('changeCard', 'updateUserName');
}

const slideToUpdatePassword = () => {
    emit('changeCard', 'updatePassword');
}

const { userSettingMenuItems, getAction } = useMenuItems({
    slideToUserInfo,
    slideToUpdateUserName,
    slideToUpdatePassword,
})

onMounted(async () => {
    await getAllUserInfo();
    // TODO ユーザ情報取得デバッグ
    console.log(userInfo)
});
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
                    <Text v-for="item in userSettingMenuItems" :key="item.text" size="large"
                        @click="() => getAction(item.actionKey)?.()">
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
                &:hover {
                    color: $hover-color;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>