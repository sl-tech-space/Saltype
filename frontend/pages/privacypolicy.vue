<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import { useLegal } from '~/composables/legal/useLegal';
import type { LegalItem } from '~/types/legal.d';

const { getPrivacyPolicySentence } = useLegal();
const privacypolicy: LegalItem[] = getPrivacyPolicySentence();

onMounted(() => {
    useHead({
        title: "プライバシーポリシー | Saltype"
    })
})
</script>

<template>
    <main class="privacypolicy">
        <div class="policy-content">
            <template v-for="(term, index) in privacypolicy" :key="index">
                <Title :text="term.title" :size="term.size" />
                <Text v-html="term.content" />
                <Separator width="large" margin="vertical" color="main-color" />
            </template>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.privacypolicy {
    @extend %full-page;
    @include horizontal-flex;
    padding: 50px 0px;

    .policy-content {
        width: 80%;
        @include vertical-flex;
    }
}
</style>