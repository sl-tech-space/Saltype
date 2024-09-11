<script setup lang="ts">
import Separator from '~/components/atoms/ui/Separator.vue';
import Timer from './ui/Timer.vue';
import Button from '~/components/atoms/buttons/Button.vue';
</script>

<template>
    <section>
        <div class="typing-header">
            <Timer />
        </div>
        <Separator color="dark-blue" width="large" margin="none" :visible="true" />
    </section>
</template>

<style lang="scss" src="@/assets/styles/components/molecules/typing-header.scss" />