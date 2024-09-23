<script setup lang="ts">
import Button from '~/components/atoms/buttons/Button.vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
});

const handleCloseModal = () => {
    emit('update:modelValue', false);
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" class="modal-overlay" @click="handleCloseModal">
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
                            <Button border="dark-blue" width="large" height="medium" background="none" :rounded="true"
                                button-text="閉じる" @click="handleCloseModal" />
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/base-modal.scss" />