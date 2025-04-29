<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseChart from '../common/BaseChart.vue';
import BaseCarousel from '../common/BaseCarousel.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';

interface ScoreProps {
    scores: number[];
}

const props = defineProps({
    scoresByCombination: {
        type: Object as PropType<Record<string, ScoreProps>>,
        required: true
    },
});

const { getLanguageName, getDifficultyName } = useLanguageAndDifficulty();

const currentSlide = ref(0);
const currentCombination = ref('');

const combinations = computed(() => Object.keys(props.scoresByCombination));

const handleSlideChange = (index: number) => {
    currentSlide.value = index;
    currentCombination.value = combinations.value[index];
};

const formattedCurrentCombination = computed(() => {
    if (!currentCombination.value) return 'エラー発生';

    const [left, right] = currentCombination.value.split('-');
    const languageId = Number(left);
    const difficultyId = Number(right);

    const languageName = getLanguageName(languageId);
    const difficultyName = getDifficultyName(difficultyId);

    return `${languageName} - ${difficultyName}`;
});

if (combinations.value.length > 0) {
    currentCombination.value = combinations.value[0];
}
</script>

<template>
    <BaseCard width="xl" height="xl" class="growth-chart-card">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="成長グラフ" />
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <Text size="large" color="main-color">
                    設定 : {{ formattedCurrentCombination }}
                </Text>
                <Separator width="medium" color="main-color" class="separator" />
                <BaseCarousel :slides="combinations.length" :options="{ loop: true }" @slide-change="handleSlideChange">
                    <template v-for="(combination, index) in combinations" :key="combination" #[`slide-${index}`]>
                        <div v-if="props.scoresByCombination[combination]?.scores?.length > 0">
                            <BaseChart :scores="props.scoresByCombination[combination].scores" />
                        </div>
                        <div v-else>
                            <Title size="small" color="main-color" text="データがありません" />
                        </div>
                    </template>
                </BaseCarousel>
            </div>
        </template>
    </BaseCard>
</template>

<style lang="scss" scoped>
.growth-chart-card {
    .header-content {
        margin-left: 4%;
    }

    .body-content {
        height: 100%;
        @include vertical-centered-flex;
    }

    .separator {
        margin: 10px 0;
    }
}
</style>
