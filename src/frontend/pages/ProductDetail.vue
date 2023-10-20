<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import { useProductStore } from '@stores/product'
import { onMounted, computed } from 'vue'
import Breadcrumb, { IBreadcrumb } from '../components/Breadcrumb.vue'

const id = useRoute().params.id
const productStore = useProductStore()
const product = computed(() => productStore.product)

const pages = computed<IBreadcrumb[]>(() => {
    return [
        { name: 'Products', href: '/product', current: false },
        { name: product.value?.name || '', href: undefined, current: true }
    ]
})

useHead({
    title: () => product.value?.name || '',
    meta: [
        {
            name: 'description',
            content: () => product.value?.description || ''
        }
    ]
})

onMounted(async () => {
    await productStore.getProductById(id.toString())
})
</script>

<template>
    <div class="bg-gray-100">
        <div
            class="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8"
        >
            <Breadcrumb :pages="pages" />
            <pre>{{ product }}</pre>
        </div>
    </div>
</template>
