<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue';
import Button from '~/components/atoms/buttons/Button.vue';

interface Props {

}

const props = defineProps<Props>();

onMounted(() => {

});
</script>

<template>
    <BaseCard width="large" height="full">
        <template #card-header>
            <div class="header-content">
                <Title size="small">

                </Title>
            </div>
        </template>
        <template #card-body>
            <div class="body-content">
                <div class="body-container">

                </div>
            </div>
        </template>
        <template #card-footer>
            <div class="footer-content">
                <Button border="sub-color" width="same-as-input-large" height="medium" background="none" :rounded="true"
                    button-text="もっと見る >>>" />
            </div>
        </template>
    </BaseCard>
</template>