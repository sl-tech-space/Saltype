<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="copyright">
        © {{ currentYear }} Saltype. All rights reserved.
    </footer>
</template>

<style lang="scss" scoped>
.copyright {
    position: fixed;
    bottom: 5px;
    right: 5px;
    font-size: 10px;
    color: $white;
    z-index: 1000;
}

/* PC用のメディアクエリ */
@media (min-width: 1200px) {
    .copyright {
        font-size: 12px;
    }
}

/* 13インチノートPC (1366x768) */
@media (min-width: 1366px) and (max-width: 1440px) {
    .copyright {
        font-size: 10px;
    }
}

/* 15.6インチノートPC (1920x1080) */
@media (min-width: 1920px) {
    .copyright {
        font-size: 10px;
    }
}
</style>