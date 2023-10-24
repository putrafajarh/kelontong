<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useAuthStore, ErrorResponse } from '@stores/auth'
import Alert from '@/components/Alert.vue'

const inputEmail = ref<string>('')
const inputPassword = ref<string>('')
const inputName = ref<string>('')
const inputConfirmPassword = ref<string>('')
const error = ref<ErrorResponse>()

const auth = useAuthStore()
const route = useRoute()
const alertData = ref<{
    type: 'error' | 'info' | 'warning' | 'success'
    message: string
}>()

const handleRegister = async () => {
    auth.register(inputEmail.value, inputPassword.value, inputName.value)
        .then((res) => {
            alertData.value = {
                type: 'success',
                message: 'Successfully registered!'
            }
            inputEmail.value = ''
            inputPassword.value = ''
            inputName.value = ''
            inputConfirmPassword.value = ''
        })
        .catch((err) => {
            if (err.response) {
                error.value = err.response.data
            }
        })
}
</script>

<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                class="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
            />
            <h2
                class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
            >
                Sign in to your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Alert
                v-if="alertData"
                :type="alertData?.type"
                :message="alertData?.message"
                class="mb-4"
            />
            <Form class="space-y-6" @submit="handleRegister">
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Email address</label
                    >
                    <div class="mt-2">
                        <Field
                            id="email"
                            v-model="inputEmail"
                            name="email"
                            as="input"
                            autocomplete="username"
                            type="email"
                            rules="required|email"
                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                            name="email"
                            class="text-red-600 text-xs mt-1"
                        />
                        <p
                            v-if="
                                error?.name === 'PrismaClientKnownRequestError'
                            "
                            class="text-red-600 text-xs mt-1"
                        >
                            {{ error.message }}
                        </p>
                    </div>
                </div>

                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Name</label
                    >
                    <div class="mt-2">
                        <Field
                            id="name"
                            v-model="inputName"
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

                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Password</label
                    >
                    <div class="mt-2">
                        <Field
                            id="password"
                            v-model="inputPassword"
                            name="password"
                            as="input"
                            autocomplete="current-password"
                            type="password"
                            rules="required|min:8|max:20"
                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                            name="password"
                            class="text-red-600 text-xs mt-1"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="confirm_password"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Confirm Password</label
                    >
                    <div class="mt-2">
                        <Field
                            id="confirm_password"
                            v-model="inputConfirmPassword"
                            name="confirm_password"
                            as="input"
                            type="password"
                            rules="required|confirmed:@password"
                            class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                            name="confirm_password"
                            class="text-red-600 text-xs mt-1"
                        />
                    </div>
                </div>

                <div>
                    <button
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Register
                    </button>
                </div>
            </Form>

            <p class="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <RouterLink
                    :to="{ name: 'login' }"
                    class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                    Sign in
                </RouterLink>
            </p>
        </div>
    </div>
</template>
