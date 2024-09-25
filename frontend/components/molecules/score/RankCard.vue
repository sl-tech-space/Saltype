<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseModal from '../common/BaseModal.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

const showModal = ref(false)

const handleOpenModal = () => {
    showModal.value = true
}

interface Props {
    rank: string
}

const props = defineProps<Props>();
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false" class="in-score-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="ランク" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Title size="medium" color="main-color" :text="props.rank" class="rank-text" />
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none" :rounded="true"
                    button-text="ランク詳細" @click="handleOpenModal" />
            </div>
        </template>
    </BaseCard>
    <BaseModal v-model="showModal">
        <template #modal-header>
            <Title size="small" color="main-color" text="ランク詳細" />
        </template>
        <template #modal-body>
            <Text size="large" text="1000 ~ : 社長" style="margin-top: 5%;" />
            <Text size="large" text="900 ~ 999 : 取締役" style="margin-top: 5%;" />
            <Text size="large" text="700 ~ 899 : 部長" style="margin-top: 5%;" />
            <Text size="large" text="500 ~ 699 : 課長" style="margin-top: 5%;" />
            <Text size="large" text="300 ~ 499 : 係長" style="margin-top: 5%;" />
            <Text size="large" text="100 ~ 299 : 主任" style="margin-top: 5%;" />
            <Text size="large" text="0 ~ 99 : メンバー" style="margin-top: 5%;" />
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
.in-score-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        @include horizontal-centered-flex;
    }

    .footer-content {
        @include horizontal-centered-flex;
    }
}
</style>