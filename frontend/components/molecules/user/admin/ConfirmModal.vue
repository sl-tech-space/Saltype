<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';

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
            <h3>確認</h3>
            <p>{{ message }}</p>
            <div class="button-container">
                <Button type="button" button-text="はい" @click="confirmDelete" />
                <Button type="button" button-text="いいえ" @click="cancelDelete" />
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    background-color: white;
    padding: 20px;
    border-radius: 8px;
}
</style>
