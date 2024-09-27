<script setup lang="ts">
import Separator from '~/components/atoms/ui/Separator.vue';

/**
 * width
 * - small 横に４枚並ぶサイズ
 * - medium 横に３枚並ぶサイズ
 * - large 横に２枚並ぶサイズ
 * - xl 画面3/2
 * - full 100%
 */
interface Props {
    cardColor?: "white" | "black" | "main-color" | "sub-color",
    sepColor?: "white" | "black" | "main-color" | "sub-color",
    width?: "small" | "medium" | "large" | "xl" | "full",
    height?: "small" | "medium" | "large" | "xl" | "full",
    headerSep?: boolean
    footerSep?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    cardColor: "black",
    sepColor: "sub-color",
    width: "medium",
    height: "medium",
    headerSep: true,
    footerSep: true
});
</script>

<template>
    <section
        :class="[`card`, `card--${props.cardColor}`, `card-width--${props.width}`, `card-height--${props.height}`]">
        <div class="card-header">
            <slot name="card-header" />
        </div>
        <Separator :color="props.sepColor" width="large" margin="none" :visible="props.headerSep" />
        <div class="card-body">
            <slot name="card-body" />
        </div>
        <Separator :color="props.sepColor" width="large" margin="none" :visible="props.footerSep" />
        <div class="card-footer">
            <slot name="card-footer" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.card {
    border-radius: 8px;
    box-shadow: 0 4px 6px $main-color, 0 1px 3px $main-color;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card:hover {
    box-shadow: 0 4px 6px $sub-color, 0 1px 3px $sub-color;
}

.card--white {
    color: $white;
}

.card--black {
    color: $black;
}

.card--main-color {
    color: $main-color;
}

.card--sub-color {
    color: $sub-color;
}

.card-width--small {
    width: 22%;
}

.card-width--medium {
    width: 30%;
}

.card-width--large {
    width: 45%;
}

.card-width--xl {
    width: 70%;
}

.card-width--full {
    width: 100%;
}

.card-height--small {
    height: 22%;
}

.card-height--medium {
    height: 40%;
}

.card-height--large {
    height: 60%;
}

.card-height--xl {
    height: 80%;
}

.card-height--full {
    height: 100%;
}

section {
    max-height: 100%;

    .card-header,
    .card-body,
    .card-footer {
        padding: 1rem;
    }

    .card-header,
    .card-footer {
        max-height: 15%;
        overflow-y: hidden;
    }

    .card-body {
        height: 70%;
        overflow-y: hidden;
    }
}
</style>