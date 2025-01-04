<script setup lang="ts">
interface Props {
    selectText?: string;
    color?: "white" | "black" | "main-color" | "sub-color";
    border?: "white" | "black" | "main-color" | "sub-color" | "none";
    width?: "small" | "medium" | "large" | "same-as-input-large";
    height?: "small" | "medium" | "large";
    background?: "white" | "black" | "main-color" | "sub-color" | "none";
    isRounded?: boolean;
    options: Array<{ value: string; label: string }>;
    modelValue: string | null;
}

const props = withDefaults(defineProps<Props>(), {
    selectText: "",
    color: "white",
    border: "none",
    width: "medium",
    height: "medium",
    background: "black",
    isRounded: false,
});

// イベントを定義
const emit = defineEmits(['update:modelValue']);

const showOptions = ref(false);
const selectedOption = ref(props.modelValue);
const highlightedIndex = ref(-1);

const toggleOptions = () => {
    showOptions.value = !showOptions.value;
};

const selectOption = (option: { value: string; label: string }) => {
    selectedOption.value = option.value;
    emit('update:modelValue', option.value);
    showOptions.value = false;
};

watch(() => props.modelValue, (newValue) => {
    selectedOption.value = newValue;
});

// キーボードイベントの処理
const handleKeyDown = (event: KeyboardEvent) => {
    if (showOptions.value) {
        if (event.key === 'ArrowDown') {
            highlightedIndex.value = (highlightedIndex.value + 1) % props.options.length; // 下に移動
        } else if (event.key === 'ArrowUp') {
            highlightedIndex.value = (highlightedIndex.value - 1 + props.options.length) % props.options.length; // 上に移動
        } else if (event.key === 'Enter') {
            if (highlightedIndex.value >= 0) {
                selectOption(props.options[highlightedIndex.value]); // 選択
            }
        }
    }
};

// コンポーネントがマウントされたときにキーボードイベントリスナーを追加
onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
});

// コンポーネントがアンマウントされるときにリスナーを削除
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleClickOutside);
});

// セレクトボックス外部クリック時にリストを閉じる
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-select')) {
        showOptions.value = false;
    }
};
</script>

<template>
    <div :class="[
        'custom-select', `select-text--${props.color}`, `select-border--${props.border}`,
        `select-width--${props.width}`, `select-height--${props.height}`, `select-background--${props.background}`,
        { 'select--rounded': props.isRounded }]" @click="toggleOptions">
        <div :class="['selected-option',]">
            {{ props.selectText }}{{ selectedOption ? options.find(option => option.value === selectedOption)?.label :
            '選択してください' }}
            <span class="arrow" :class="{ 'up': showOptions, 'down': !showOptions }"></span>
        </div>
        <ul :class="['options', `select-border--${props.border}`, `select-background--${props.background}`]"
            v-if="showOptions">
            <li v-for="(option, index) in options" :key="option.value" @click.stop="selectOption(option)"
                :class="{ 'highlighted': highlightedIndex === index }">
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.custom-select {
    position: relative;
    cursor: pointer;
    display: table;
    font-size: 14px;
}

.selected-option {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;

    li {
        list-style-type: none;
        border-bottom: 1px solid;
        padding: 4px;

        &:hover,
        &.highlighted {
            background-color: $main-color;
        }
    }
}

.arrow {
    margin-left: auto;
}

.arrow.down::after {
    content: '▼';
}

.arrow.up::after {
    content: '▲';
}

/* text */
.select-text--white {
    color: $white;
}

.select-text--black {
    color: $black;
}

.select-text--main-color {
    color: $main-color;
}

.select-text--sub-color {
    color: $sub-color;
}

/* border */
.select-border--white {
    border: 2px solid $white;
}

.select-border--black {
    border: 2px solid $black;
}

.select-border--main-color {
    border: 2px solid $main-color;
}

.select-border--sub-color {
    border: 2px solid $sub-color;
}

.select-border--none {
    border: none;
}

/* width */
.select-width--small {
    max-width: 100%;
    width: 80px;
}

.select-width--medium {
    max-width: 100%;
    width: 120px;
}

.select-width--large {
    max-width: 100%;
    width: 160px;
}

.select-width--same-as-input-large {
    max-width: 100%;
    width: 350px;
}

/* height */
.select-height--small {
    max-height: 100%;
    height: 30px;
}

.select-height--medium {
    max-height: 100%;
    height: 40px;
}

.select-height--large {
    max-height: 100%;
    height: 50px;
}

/* background */
.select-background--white {
    background-color: $white;
}

.select-background--black {
    background-color: $black;
}

.select-background--main-color {
    background-color: $main-color;
}

.select-background--sub-color {
    background-color: $sub-color;
}

.select-background--none {
    background-color: transparent;
}

/* round */
.select--rounded {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .options {
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

/* responsive */
@media (max-width: 1200px) {
    .select-width--large {
        width: 140px;
    }

    .select-width--same-as-input-large {
        width: 300px;
    }
}

@media (max-width: 992px) {
    .select-width--medium {
        width: 100px;
    }

    .select-width--large {
        width: 120px;
    }

    .select-width--same-as-input-large {
        width: 250px;
    }

    .select-height--large {
        height: 45px;
    }
}

@media (max-width: 768px) {
    .select-width--small {
        width: 70px;
    }

    .select-width--medium {
        width: 90px;
    }

    .select-width--large {
        width: 110px;
    }

    .select-width--same-as-input-large {
        width: 200px;
    }

    .select-height--medium {
        height: 35px;
    }

    .select-height--large {
        height: 40px;
    }
}

@media (max-width: 576px) {
    .select-width--small {
        width: 60px;
    }

    .select-width--medium {
        width: 80px;
    }

    .select-width--large {
        width: 100px;
    }

    .select-width--same-as-input-large {
        width: 100%;
    }

    .select-height--small {
        height: 28px;
    }

    .select-height--medium {
        height: 32px;
    }

    .select-height--large {
        height: 36px;
    }
}
</style>
