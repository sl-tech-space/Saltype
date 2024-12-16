<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Button from '~/components/atoms/buttons/Button.vue';

interface Props {
    ranking: number
}

const props = defineProps<Props>();
const router = useRouter();

const handleNavigateToRanking = async () => {
    await router.push({ name: "ranking" });
}
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false" class="in-score-card">
        <template #card-header>
            <div class="header-content">
                <Text size="large" text="ランキング" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Title size="medium" color="main-color" :text="props.ranking.toString()" />
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none"
                    :is-rounded="true" button-text="全体ランキングへ" @click="handleNavigateToRanking" />
            </div>
        </template>
    </BaseCard>
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