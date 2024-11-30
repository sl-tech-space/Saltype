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
    isFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    cardColor: "black",
    sepColor: "sub-color",
    width: "medium",
    height: "medium",
    headerSep: true,
    footerSep: true,
    isFooter: true
});
</script>

<template>
    <section
        :class="[`card`, `card--${props.cardColor}`, `card-width--${props.width}`, `card-height--${props.height}`]">
        <div class="card-header">
            <slot name="card-header" />
        </div>
        <Separator v-if="props.headerSep" :color="props.sepColor" width="large" margin="none" />
        <div class="card-body">
            <slot name="card-body" />
        </div>
        <Separator v-if="props.footerSep" :color="props.sepColor" width="large" margin="none" />
        <div class="card-footer" v-if="isFooter">
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
    margin: 0.5rem;
    transition: box-shadow 0.3s ease;
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

// 基本のカードサイズ設定
.card-width--small {
    width: calc(22% - 1rem);
}

.card-width--medium {
    width: calc(30% - 1rem);
}

.card-width--large {
    width: calc(45% - 1rem);
}

.card-width--xl {
    width: calc(70% - 1rem);
}

.card-width--full {
    width: calc(100% - 1rem);
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
        flex: 1;
        overflow-y: hidden;
    }
}

/* responsive */
@media (min-width: 1200px) and (max-width: 1600px) {
    .card-width--small {
        width: calc(25% - 1rem);
    }

    .card-width--medium {
        width: calc(33.333% - 1rem);
    }

    .card-width--large {
        width: calc(50% - 1rem);
    }

    .card-width--xl {
        width: calc(75% - 1rem);
    }
}

@media (min-width: 992px) and (max-width: 1199px) {
    .card-width--small {
        width: calc(33.333% - 1rem);
    }

    .card-width--medium {
        width: calc(50% - 1rem);
    }

    .card-width--large {
        width: calc(66.666% - 1rem);
    }

    .card-width--xl {
        width: calc(80% - 1rem);
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .card-width--small {
        width: calc(50% - 1rem);
    }

    .card-width--medium {
        width: calc(66.666% - 1rem);
    }

    .card-width--large,
    .card-width--xl {
        width: calc(100% - 1rem);
    }
}

@media (max-height: 900px) {
    .card-height--medium {
        height: 50%;
    }

    .card-height--large {
        height: 70%;
    }

    .card-height--xl {
        height: 90%;
    }
}

@media (max-height: 700px) {
    .card-height--small {
        height: 30%;
    }

    .card-height--medium {
        height: 60%;
    }

    .card-height--large {
        height: 80%;
    }

    .card-height--xl {
        height: 95%;
    }
}
</style>