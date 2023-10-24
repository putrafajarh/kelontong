<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { TrashIcon } from '@heroicons/vue/24/solid'

import { useProductStore, ProductData } from '@stores/product'
import router from '@/router'

import Breadcrumb from '../components/Breadcrumb.vue'

const productStore = useProductStore()
const products = computed(() => productStore.products)
const pagination = computed(() => productStore.pagination)
const route = useRoute()

const searchQuery = route.query.search as string

const page = ref(parseInt(route.query.page as string) || 1)
const perPage = ref(parseInt(route.query.perPage as string) || 20)

const goToPrevPage = () => {
    if (page.value > 1) {
        page.value--
        router.push({ path: '/product', query: { page: page.value } })
    }
}

const goToNextPage = () => {
    page.value++
    router.push({ path: '/product', query: { page: page.value } })
}

onMounted(async () => {
    await productStore.getAllProducts(page.value, perPage.value, searchQuery)
})

watch([page, perPage], async ([newPage, newPerPage], [oldPage, oldPerPage]) => {
    if (newPage !== oldPage || newPerPage !== oldPerPage) {
        await productStore.getAllProducts(newPage, newPerPage)
    }
})

const pages = [{ name: 'Products', href: undefined, current: true }]

const handleProductDetail = (product: ProductData) => {
    router.push({ path: `/product/${product.id}` })
}

const handleDeleteProduct = (id: string) => {
    productStore.deleteProduct(id)
}

useHead
</script>

<template>
    <div class="bg-gray-100">
        <div
            class="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8"
        >
            <div class="flex w-full mb-8">
                <div class="grow">
                    <Breadcrumb :pages="pages" />
                </div>
                <div class="flex items-center pl-4">
                    <RouterLink
                        to="/product/create"
                        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create
                    </RouterLink>
                </div>
            </div>
            <div
                class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8"
            >
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="group cursor-pointer relative flex flex-col rounded-lg border border-gray-200 bg-white drop-shadow-sm"
                    @click="handleProductDetail(product)"
                >
                    <button
                        class="z-10 bg-red-700 border border-white w-8 h-8 rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 group-hover:flex hidden items-center justify-center text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        @click.stop.prevent="handleDeleteProduct(product.id)"
                    >
                        <TrashIcon
                            class="mx-auto h-5 w-5 text-gray-100"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        class="relative aspect-square overflow-hidden bg-gray-200 group-hover:opacity-75"
                    >
                        <img
                            :src="product.image"
                            :alt="product.name"
                            class="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                        <span
                            v-if="product.category"
                            class="text-sm text-white bg-red-600 rounded leading-none py-1 px-1.5 absolute left-2 top-2"
                            >{{ product.category.name }}</span
                        >
                    </div>
                    <div class="flex flex-1 flex-col space-y-2 p-4">
                        <h2 class="text-base font-bold text-gray-900">
                            <span aria-hidden="true" class="absolute inset-0" />
                            {{ product.name }}
                        </h2>
                        <p class="text-sm text-gray-500">
                            {{ product.description }}
                        </p>
                        <div class="flex flex-1 flex-col justify-end">
                            <div class="flex gap-1.5 items-center">
                                <Icon
                                    class="inline"
                                    name="bitcoin"
                                    width="20"
                                    height="20"
                                ></Icon>
                                <span class="font-bold text-gray-900">{{
                                    product.price
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="products.length > 0" class="mt-8">
                <nav
                    class="flex items-center justify-between px-4 py-3 sm:px-6"
                    aria-label="Pagination"
                >
                    <div class="hidden sm:block">
                        <p class="text-sm text-gray-700">
                            Showing
                            {{ ' ' }}
                            <span class="font-medium">{{ page }}</span>
                            {{ ' ' }}
                            to
                            {{ ' ' }}
                            <span class="font-medium">{{
                                page * perPage < pagination.total
                                    ? page * perPage
                                    : pagination.total
                            }}</span>
                            {{ ' ' }}
                            of
                            <span class="font-medium">{{
                                pagination.total
                            }}</span>
                            {{ ' ' }}
                            results
                        </p>
                    </div>
                    <div class="flex flex-1 justify-between sm:justify-end">
                        <a
                            v-if="page > 1"
                            class="relative cursor-pointer inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            @click.prevent="goToPrevPage"
                            >Previous</a
                        >
                        <a
                            v-if="page < pagination.lastPage"
                            class="relative cursor-pointer ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            @click.prevent="goToNextPage"
                            >Next</a
                        >
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>

<style scoped>
#breadcrumb {
    @apply !mb-0;
}
</style>
