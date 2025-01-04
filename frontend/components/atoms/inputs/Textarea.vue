<script setup lang="ts">
interface Props {
    type?: string;
    id?: string;
    modelValue?: string | number | readonly string[] | null;
    placeholder?: string;
    required?: boolean;
    color?: "white" | "black" | "main-color" | "sub-color";
    border?: "white" | "black" | "main-color" | "sub-color" | "none";
    width?: "small" | "medium" | "large";
    height?: "small" | "medium" | "large";
    background?: "white" | "black" | "main-color" | "sub-color";
    isRounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: "text",
    id: "default",
    required: false,
    color: "white",
    border: "none",
    width: "medium",
    height: "medium",
    background: "black",
    isRounded: false,
});

defineEmits(["update:modelValue"]);

const getStringValue = (value: Props['modelValue']): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) return value.join(',');
    return '';
};
</script>

<template>
    <textarea :id="props.id" :value="getStringValue(modelValue)" :name="props.id" :placeholder="props.placeholder"
        :required="props.required" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :class="[
            `input-text--${props.color}`,
            `input-border--${props.border}`,
            `input-width--${props.width}`,
            `input-height--${props.height}`,
            `input-background--${props.background}`,
            { 'input--rounded': props.isRounded },
        ]">
    </textarea>
</template>

<style lang="scss" scoped>
/* text */
.input-text--white {
    color: $white;

    &:-webkit-autofill {
        -webkit-text-fill-color: $white;
    }
}

.input-text--black {
    color: $black;

    &:-webkit-autofill {
        -webkit-text-fill-color: $black;
    }
}

.input-text--main-color {
    color: $main-color;

    &:-webkit-autofill {
        -webkit-text-fill-color: $main-color;
    }
}

.input-text--sub-color {
    color: $sub-color;

    &:-webkit-autofill {
        -webkit-text-fill-color: $sub-color;
    }
}

/* border */
.input-border--white {
    border-color: $white;
}

.input-border--black {
    border-color: $black;
}

.input-border--main-color {
    border-color: $main-color;
}

.input-border--sub-color {
    border-color: $sub-color;
}

.input-border--none {
    border: none;
}

/* width */
.input-width--small {
    max-width: 100%;
    width: 150px;
}

.input-width--medium {
    max-width: 100%;
    width: 250px;
}

.input-width--large {
    max-width: 100%;
    width: 350px;
}

/* height */
.input-height--small {
    max-height: 100%;
    height: 30px;
}

.input-height--medium {
    max-height: 100%;
    height: 40px;
}

.input-height--large {
    max-height: 100%;
    height: 50px;
}

/* background */
.input-background--white {
    background-color: $white;

    &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $white inset;
    }
}

.input-background--black {
    background-color: $black;

    &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $black inset;
    }
}

.input-background--main-color {
    background-color: $main-color;

    &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $main-color inset;
    }
}

.input-background--sub-color {
    background-color: $sub-color;

    &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $sub-color inset;
    }
}

/* round */
.input--rounded {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

textarea {
    white-space: pre-wrap;
    word-wrap: break-word;
    resize: none;
    font-size: 1.2rem;
    padding: 10px;
    box-sizing: border-box;

    &:focus {
        border-color: $hover-color;
        outline: none;
    }
}
</style>
