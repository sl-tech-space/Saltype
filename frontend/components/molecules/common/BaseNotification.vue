<script setup lang="ts">
import Text from '~/components/atoms/texts/Text.vue';

interface Props {
    message: string;
    content: string;
    show: boolean;
}

const props = defineProps<Props>();
const isVisible = ref(false);
const notificationRef = ref<HTMLDivElement | null>(null);

watch(() => props.show, async (newValue) => {
    if (newValue) {
        isVisible.value = true;
        await nextTick();
        adjustHeight();
        setTimeout(() => {
            isVisible.value = false;
        }, 5000);
    }
});

const adjustHeight = () => {
    if (notificationRef.value) {
        notificationRef.value.style.height = 'auto';
        const height = notificationRef.value.scrollHeight;
        notificationRef.value.style.height = `${height}px`;
    }
};
</script>

<template>
    <Transition name="fade">
        <div v-if="isVisible" ref="notificationRef" class="notification">
            <Text size="large" color="white">
                {{ message }}
            </Text>
            <Text color="white">
                送信内容&nbsp;:&nbsp;{{ content }}
            </Text>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.notification {
    width: 20%;
    min-height: 10vh;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: $black;
    padding: 15px;
    border: 2px solid $main-color;
    border-radius: 5px;
    box-shadow: 0 2px 10px $sub-color;
    z-index: 1000;
    word-wrap: break-word;
    overflow: hidden;
    transition: height 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, height 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>