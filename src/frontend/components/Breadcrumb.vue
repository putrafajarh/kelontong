<script setup lang="ts">
import { defineProps } from 'vue'
import { HomeIcon } from '@heroicons/vue/24/outline'

export interface IBreadcrumb {
    name: string
    href: string | undefined
    current: boolean
}

const props = defineProps({
    pages: {
        type: Array as () => IBreadcrumb[],
        required: true,
        default: () => []
    }
})
</script>

<template>
    <nav
        id="breadcrumb"
        class="flex drop-shadow-sm mb-8 border-y border-gray-200 bg-white"
        aria-label="Breadcrumb"
    >
        <ol
            role="list"
            class="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8"
        >
            <li class="flex">
                <div class="flex items-center">
                    <RouterLink
                        to="/"
                        class="text-gray-400 hover:text-gray-500"
                    >
                        <HomeIcon
                            class="h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                        />
                        <span class="sr-only">Home</span>
                    </RouterLink>
                </div>
            </li>
            <li v-for="page in props.pages" :key="page.name" class="flex">
                <div class="flex items-center">
                    <svg
                        class="h-full w-6 flex-shrink-0 text-gray-200"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a
                        :href="page.href"
                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        :aria-current="page.current ? 'page' : undefined"
                        >{{ page.name }}</a
                    >
                </div>
            </li>
        </ol>
    </nav>
</template>
