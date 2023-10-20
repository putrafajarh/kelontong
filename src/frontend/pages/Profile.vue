<script setup lang="ts">
import { useAuthStore } from '@stores/auth'

const auth = useAuthStore()
</script>

<template>
    <div class="overflow-scroll">
        <pre>{{ auth.user }}</pre>
    </div>
</template>
