<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Title from '~/components/atoms/texts/Title.vue';

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
                <ul class="menu-list">
                    <li>
                        <Text text="ユーザ情報" size="large" @click="slideToUserInfo" />
                        <Text text="ユーザ名変更" size="large" @click="slideToUpdateUserName" />
                        <Text text="パスワード変更" size="large" @click="slideToUpdatePassword" />
                    </li>
                </ul>
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
        @include horizontal-flex;

        .menu-list {
            margin-top: 10%;

            li {
                list-style-type: none;

                p {
                    margin-top: 10%;

                    &:hover {
                        color: $hover-color;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>