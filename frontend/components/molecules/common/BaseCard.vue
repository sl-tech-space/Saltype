<script setup lang="ts">
import Separator from '~/components/atoms/ui/Separator.vue';

/**
 * width
 * - small 横に４枚並ぶサイズ
 * - medium 横に３枚並ぶサイズ
 * - large 横に２枚並ぶサイズ
 */
interface Props {
    cardColor?: "white" | "black" | "blue" | "dark-blue",
    sepColor?: "white" | "black" | "blue" | "dark-blue",
    width?: "small" | "medium" | "large" | "xl",
    height?: "small" | "medium" | "large" | "xl",
    headerSep?: boolean
    footerSep?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    cardColor: "black",
    sepColor: "dark-blue",
    width: "medium",
    height: "medium",
    headerSep: true,
    footerSep: true
});
</script>

<template>
    <section :class="[`card`, `card--${props.cardColor}`, `card-width--${$props.width}`, `card-height--${$props.height}`]">
        <div class="card-header">
            <slot name="card-header" />
        </div>
        <Separator :color="props.sepColor" width="large" margin="vertical" :visible="props.headerSep" />
        <div class="card-body">
            <slot />
        </div>
        <Separator :color="props.sepColor" width="large" margin="vertical" :visible="props.footerSep" />
        <div class="card-footer">
            <slot name="card-footer" />
        </div>
    </section>
</template>

<style lang="sass" src="@/assets/styles/components/molecules/base-card.scss" />