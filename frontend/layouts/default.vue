<script setup lang="ts">
import CookieConsent from '~/components/molecules/common/ui/CookieConsent.vue';
import CustomStyles from '~/components/molecules/common/ui/CustomStyles.vue';
import CursorEffect from '~/components/molecules/common/ui/CursorEffect.vue';
import CopyRight from '~/components/atoms/ui/CopyRight.vue';
</script>

<template>
    <div class="layout">
        <CustomStyles />
        <CookieConsent />
        <CursorEffect />
        <CopyRight />
        <slot />
    </div>
</template>