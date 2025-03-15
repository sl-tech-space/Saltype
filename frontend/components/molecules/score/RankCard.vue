<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseModal from '../common/BaseModal.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

const showModal = ref(false);
const modalRef = ref();

const handleOpenModal = () => {
    showModal.value = true;
};

const handleCloseModal = () => {
    modalRef.value?.close();
};

interface Props {
    rank: string
}

const props = defineProps<Props>();

const ranks = [
    { scoreRange: "900 ~", title: "社長" },
    { scoreRange: "800 ~ 899", title: "取締役" },
    { scoreRange: "700 ~ 799", title: "部長" },
    { scoreRange: "600 ~ 699", title: "課長" },
    { scoreRange: "500 ~ 599", title: "係長" },
    { scoreRange: "400 ~ 499", title: "主任" },
    { scoreRange: "0 ~ 399", title: "メンバー" },
];
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false" class="in-score-card">
        <template #card-header>
            <div class="header-content">
                <Text size="large" text="ランク" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Title size="medium" color="main-color" :text="props.rank" class="rank-text" />
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none"
                    :is-rounded="true" button-text="ランク詳細" @click="handleOpenModal" />
            </div>
        </template>
    </BaseCard>
    <BaseModal ref="modalRef" v-model="showModal" :close-on-outside-click="true">
        <template #modal-header>
            <Title size="small" color="main-color" text="ランク詳細" />
        </template>
        <template #modal-body>
            <Text size="large" text="ランクは正タイプ数から判定されます。" style="margin-top: 5%;" />
            <div v-for="(rank, index) in ranks" :key="index">
                <Text size="large" :text="`${rank.scoreRange} : ${rank.title}`" style="margin-top: 5%;" />
            </div>
        </template>
        <template #modal-footer>
            <Button border="sub-color" width="large" height="medium" background="none" :is-rounded="true"
                button-text="閉じる" @click="handleCloseModal" />
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
.in-score-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        margin-top: 10px;
        @include horizontal-centered-flex;
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
}
</style>