<script setup lang="ts">
import Breadcrumb from '../components/Breadcrumb.vue';

const pages = [
  { name: '', href: undefined, current: true },
]
</script>

<template>
    <div class="bg-gray-100">
        <div class="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
            <Breadcrumb :pages="pages" />
            <h1>HOME</h1>
        </div>
    </div>
</template>