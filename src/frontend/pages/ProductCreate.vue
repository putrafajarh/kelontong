<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import { useProductStore, ErrorResponse } from '@stores/product'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Breadcrumb, { IBreadcrumb } from '../components/Breadcrumb.vue'
import { PhotoIcon } from '@heroicons/vue/24/solid'

const productStore = useProductStore()
const product = computed(() => productStore.product)
const user = computed(() => useAuthStore().user)
const imageData = ref<File | null>(null)
const error = ref<ErrorResponse>()

// form data
const name = ref<string>('')
const sku = ref<string>('')
const description = ref<string>('')
const price = ref<number>(0)
const weight = ref<number>(0)
const width = ref<number>(0)
const length = ref<number>(0)
const height = ref<number>(0)

const pages = computed<IBreadcrumb[]>(() => {
    return [
        { name: 'Products', href: '/product', current: false },
        { name: 'Create', href: undefined, current: true }
    ]
})

const handleCreateProduct = async () => {
    // create variables
    const data = {
        name: name.value,
        sku: sku.value,
        description: description.value,
        price: price.value,
        weight: weight.value,
        width: width.value,
        length: length.value,
        height: height.value,
        image: imageData.value,
        userId: user.value?.id
    }
    productStore
        .createProduct(data, imageData.value)
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            if (err.response) {
                error.value = err.response.data
            }
        })
}

useHead({
    title: () => 'Create Product'
})
</script>

<template>
    <div class="bg-gray-100">
        <div
            class="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8"
        >
            <Breadcrumb :pages="pages" />
            <div class="bg-white drop-shadow-sm rounded-md py-6 px-6">
                <Form @submit="handleCreateProduct">
                    <div class="space-y-12">
                        <div class="border-b border-gray-900/10 pb-12">
                            <div
                                class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                            >
                                <div class="sm:col-span-4">
                                    <div class="mt-2">
                                        <div
                                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                                        >
                                            <span
                                                class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"
                                                >SKU</span
                                            >
                                            <Field
                                                id="sku"
                                                v-model="sku"
                                                name="sku"
                                                as="input"
                                                type="text"
                                                rules="required"
                                                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="sku"
                                            class="text-red-600 text-xs mt-1"
                                        />
                                        <span
                                            v-if="
                                                error?.name ===
                                                'SKUAlreadyExistsError'
                                            "
                                            role="alert"
                                            class="text-red-600 text-xs mt-1"
                                        >
                                            {{ error.message }}
                                        </span>
                                    </div>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        for="name"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Product Name</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="name"
                                            v-model="name"
                                            name="name"
                                            as="input"
                                            type="text"
                                            rules="required"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        for="description"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Description</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="description"
                                            v-model="description"
                                            name="description"
                                            as="textarea"
                                            rows="3"
                                            rules="required"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </div>
                                    <p
                                        class="mt-3 text-sm leading-6 text-gray-600"
                                    >
                                        Give a few sentences about this product.
                                    </p>
                                </div>

                                <div class="sm:col-span-3">
                                    <label
                                        for="price"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Price</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="price"
                                            v-model="price"
                                            name="price"
                                            as="input"
                                            type="text"
                                            rules="required|numeric"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage
                                            name="price"
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div class="sm:col-span-3">
                                    <label
                                        for="weight"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Weight</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="weight"
                                            v-model="weight"
                                            name="weight"
                                            as="input"
                                            type="text"
                                            rules="numeric"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage
                                            name="weight"
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Product Image</label
                                    >
                                    <label
                                        for="image"
                                        class="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                                    >
                                        <div class="text-center">
                                            <PhotoIcon
                                                class="mx-auto h-12 w-12 text-gray-300"
                                                aria-hidden="true"
                                            />
                                            <div
                                                class="mt-4 text-sm leading-6 text-gray-600"
                                            >
                                                <p
                                                    class="font-semibold text-indigo-600"
                                                >
                                                    Upload a file
                                                </p>
                                                <Field
                                                    id="image"
                                                    v-model="imageData"
                                                    name="image"
                                                    type="file"
                                                    class="sr-only"
                                                    :rules="{
                                                        required: true,
                                                        mimes: [
                                                            'image/jpeg',
                                                            'image/png'
                                                        ],
                                                        size: 2 * 1000
                                                    }"
                                                />
                                                <p
                                                    class="text-xs leading-5 text-gray-600"
                                                >
                                                    PNG, JPG up to 2MB
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                    <ErrorMessage
                                        name="image"
                                        class="text-red-600 text-xs mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="border-b border-gray-900/10 pb-12">
                            <h2
                                class="text-base font-semibold leading-7 text-gray-900"
                            >
                                Product Dimensions
                            </h2>
                            <p class="mt-1 text-sm leading-6 text-gray-600">
                                A product's dimension is quite simply the size
                                of a product. Its height, width, and length are
                                measured to help identify product variants that
                                often help shoppers with their purchase
                                decisions.
                            </p>

                            <div
                                class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                            >
                                <div class="sm:col-span-2 sm:col-start-1">
                                    <label
                                        for="width"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Width</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="width"
                                            v-model="width"
                                            name="width"
                                            as="input"
                                            type="text"
                                            rules="numeric"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div class="sm:col-span-2">
                                    <label
                                        for="length"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Length</label
                                    >
                                    <div class="mt-2">
                                        <Field
                                            id="length"
                                            v-model="length"
                                            name="length"
                                            as="input"
                                            type="text"
                                            rules="numeric"
                                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div class="sm:col-span-2">
                                    <label
                                        for="height"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Height</label
                                    >
                                    <div class="mt-2">
                                        <div class="mt-2">
                                            <Field
                                                id="height"
                                                v-model="height"
                                                name="height"
                                                as="input"
                                                type="text"
                                                rules="numeric"
                                                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-x-6">
                        <RouterLink
                            to="/product"
                            class="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Cancel
                        </RouterLink>
                        <button
                            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>
