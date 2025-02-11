<script setup lang="ts">
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';
import Separator from '~/components/atoms/ui/Separator.vue';
import { useLegal } from '~/composables/legal/useLegal';
import type { LegalItem } from '~/types/legal.d';

const { getCookiePolicySentence } = useLegal();
const cookiePolicySentence: LegalItem[] = getCookiePolicySentence();

definePageMeta({
    layout: "policy",
});

onMounted(() => {
    useHead({
        title: "クッキーポリシー | Saltype"
    })
})
</script>

<template>
    <main class="terms">
        <div class="terms-content">
            <template v-for="(term, index) in cookiePolicySentence" :key="index">
                <Title :text="term.title" :size="term.size" />
                <Text v-html="term.content" />
                <Separator width="large" margin="vertical" color="main-color" />
            </template>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.terms {
    @extend %full-page;
    @include horizontal-flex;
    padding: 50px 0px;

    .terms-content {
        width: 80%;
        @include vertical-flex;
    }
}
</style>