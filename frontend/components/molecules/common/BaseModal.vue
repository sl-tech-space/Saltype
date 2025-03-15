<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
    // モーダル外クリックでの閉じる機能を制御するプロップス（デフォルトはtrue）
    closeOnOutsideClick?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
    document.body.style.overflow = newValue ? 'hidden' : '';
});

// モーダルを閉じる処理
const handleCloseModal = () => {
    emit('update:modelValue', false);
};

// モーダル外クリック時の処理
const handleOverlayClick = (e: MouseEvent) => {
    // モーダル外クリックでの閉じる機能が無効化されていない場合のみ閉じる
    if (props.closeOnOutsideClick !== false && e.target === e.currentTarget) {
        handleCloseModal();
    }
};

const blockEvents = (e: Event) => {
    if (props.modelValue) {
        e.stopPropagation();
    }
};

onMounted(() => {
    if (props.modelValue) {
        document.body.style.overflow = 'hidden';
    }
});

onUnmounted(() => {
    document.body.style.overflow = '';
});

// closeメソッドを外部に公開
defineExpose({
    close: handleCloseModal
});
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick" @keydown.stop @keypress.stop @keyup.stop>
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <slot name="modal-header"></slot>
                    </div>
                    <div class="modal-body">
                        <div class="modal-container">
                            <slot name="modal-body"></slot>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <slot name="modal-footer">
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    z-index: 1000;

    .modal-content {
        max-width: 700px;
        width: 90%;
        max-height: 80%;
        height: 80%;
        background-color: $black;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        z-index: 1001;

        .modal-header {
            height: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }

        .modal-body {
            height: 60%;
            display: flex;
            justify-content: center;
            overflow-y: auto;
            padding: 10px;

            .modal-container {
                margin-top: 2%;
            }
        }

        .modal-footer {
            height: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>