<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';
import Title from '~/components/atoms/texts/Title.vue';
import Text from '~/components/atoms/texts/Text.vue';

const props = defineProps<{
    show: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}>();

const confirmDelete = () => {
    props.onConfirm();
};

const cancelDelete = () => {
    props.onCancel();
};
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <Title size="small" text="確認" />
            <Text size="large">{{ message }}</Text>
            <div class="button-container">
                <Button type="button" button-text="はい" border="main-color" :is-rounded="true" @click="confirmDelete" />
                <Button type="button" button-text="いいえ" border="main-color" :is-rounded="true" @click="cancelDelete" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: $black;
    padding: 20px;
    border-radius: 8px;
}

.button-container {
    margin-top: 5%;
    display: flex;
    justify-content: space-around;
}
</style>
