<script setup lang="ts">
import Label from '~/components/atoms/labels/Label.vue';
import Input from '~/components/atoms/inputs/Input.vue';
import { useColorStore } from '~/store/colorStore'

const { colorStore, setColor } = useColorStore()

const customLabels = {
    textColor: "テキストの色設定",
    backgroundColor: "背景の色設定",
    mainColor: "メインの色設定",
    subColor: "サブの色設定",
    hoverColor: "カーソルを当てた時の色設定"
};

const updateColor = (name: string, event: Event) => {
    const target = event.target as HTMLInputElement
    setColor(name, target.value)
}
</script>

<template>
    <div v-for="(color, name) in colorStore" :key="name" class="palette">
        <Label :for="name" color="white" :label="customLabels[name] + ' :'" />
        <Input :id="name" type="color" :value="color" width="large"
            @input="(event: Event) => updateColor(name, event)" />
    </div>
</template>

<style lang="scss" scoped>
.palette {
    margin-top: 5%;
    @include vertical-flex;
}
</style>