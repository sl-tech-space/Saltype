<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import BaseChart from '../common/BaseChart.vue';
import BaseCarousel from '../common/BaseCarousel.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import { useLanguageAndDifficulty } from '~/composables/typing/useLanguageAndDifficulty';

interface ScoreProps {
    score: number;
}

const props = defineProps({
    scoresByCombination: {
        type: Object as PropType<Record<string, Array<ScoreProps>>>,
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
    if (!currentCombination.value) return 'No combination selected';

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
    <BaseCard width="xl" height="xl">
        <template #card-header>
            <div class="header-content">
                <Title size="small" text="成長グラフ" />
            </div>
        </template>
        <template #card-body>
            <BaseCarousel :slides="combinations.length" :options="{ loop: true }" @slide-change="handleSlideChange">
                <template v-for="(combination, index) in combinations" :key="combination" #[`slide-${index}`]>
                    <div v-if="props.scoresByCombination[combination].length > 0">
                        <BaseChart :scores="props.scoresByCombination[combination]" />
                    </div>
                    <div v-else>
                        <Title size="small" color="blue" text="データがありません" />
                    </div>
                </template>
            </BaseCarousel>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Text size="large" color="blue">
                    設定 : {{ formattedCurrentCombination }}
                </Text>
            </div>
        </template>
    </BaseCard>
</template>
