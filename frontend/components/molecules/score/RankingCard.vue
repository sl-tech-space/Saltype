<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Button from '~/components/atoms/buttons/Button.vue';

interface Props {
    ranking: number
}

const props = defineProps<Props>();
const router = useRouter();

const handleNavigateToRanking = async () => {
    router.push({ name: "ranking" });
}
</script>

<template>
    <BaseCard width="large" height="full" :footer-sep="false">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="ランキング" class="card-text" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Title size="medium" color="blue" :text="props.ranking.toString()" />
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="dark-blue" width="same-as-input-large" height="medium" background="none" :rounded="true"
                    button-text="全体ランキングへ" @click="handleNavigateToRanking" />
            </div>
        </template>
    </BaseCard>
</template>