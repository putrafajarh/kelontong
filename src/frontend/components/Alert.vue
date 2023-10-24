<script setup lang="ts">
import {
    XCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/vue/20/solid'
import { computed, defineProps } from 'vue'

const props = defineProps<{
    type: 'error' | 'info' | 'warning' | 'success'
    message: string
}>()

const containerClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'rounded-md bg-green-50 p-4'
        case 'error':
            return 'rounded-md bg-red-60 p-4'
        case 'warning':
            return 'rounded-md bg-yellow-50 p-4'
        case 'info':
            return 'rounded-md bg-blue-50 p-4'
        default:
            return ''
    }
})

const iconComponent = computed(() => {
    switch (props.type) {
        case 'success':
            return CheckCircleIcon
        case 'error':
            return XCircleIcon
        case 'warning':
            return ExclamationTriangleIcon
        case 'info':
            return InformationCircleIcon
        default:
            return ''
    }
})

const iconClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'h-5 w-5 text-green-400'
        case 'error':
            return 'h-5 w-5 text-red-400'
        case 'warning':
            return 'h-5 w-5 text-yellow-400'
        case 'info':
            return 'h-5 w-5 text-blue-400'
        default:
            return ''
    }
})

const messageClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'text-green-800'
        case 'error':
            return 'text-red-800'
        case 'warning':
            return 'text-yellow-800'
        case 'info':
            return 'text-blue-800'
        default:
            return ''
    }
})
</script>

<template>
    <div :class="containerClass">
        <div class="flex">
            <div class="flex-shrink-0">
                <component
                    :is="iconComponent"
                    :class="iconClass"
                    aria-hidden="true"
                />
            </div>
            <div class="ml-3">
                <p :class="messageClass" class="text-sm font-medium">
                    {{ props.message }}
                </p>
            </div>
        </div>
    </div>
</template>
