<script setup lang="ts">
import BaseCard from '../../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';

const props = defineProps({
    userId: String,
    userName: String,
    email: String,
    passwordExists: Boolean
});
</script>

<template>
    <div class="component-root">
        <BaseCard width="xl" height="xl" class="user-info">
            <template #card-header>
                <div class="header-content">
                    <Title size="small" text="ユーザ情報" class="card-text" />
                </div>
            </template>
            <template #card-body>
                <div class="body-content">
                    <div class="body-content-container">
                        <Text size="large">ユーザ名&nbsp;:&nbsp;{{ props.userName }}</Text>
                        <Text size="large">メールアドレス&nbsp;:&nbsp;{{ props.email }}</Text>
                    </div>
                </div>
            </template>
        </BaseCard>
    </div>
</template>

<style lang="scss" scoped>
.component-root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    align-items: center;
}

.header-content {
    margin-left: 4%;
}

.body-content {
    width: 100%;
    height: 100%;
    @include horizontal-flex;
}

.body-content-container {
    @include vertical-flex;

    p {
        margin-top: 5%;
    }
}
</style>