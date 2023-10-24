import { defineStore } from 'pinia'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import http from '../axios'
import router from '@/router'
import { useRoute } from 'vue-router'

enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export type AuthUser = {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
    signature: string
}

export interface ErrorResponse {
    status: string
    message: string
    name?: string
    errors?: string[] | string
}

export interface AuthResponse {
    id: string
    name: string
    email: string
    role: Role
    accessToken: string
    signature: string
}

export interface RegisterResponse {
    id: string
    name: string
    email: string
    role: Role
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null
    }),
    getters: {
        accessToken: (state) => {
            return state.user ? state.user.accessToken : null
        },
        signature: (state) => {
            return state.user ? state.user.signature : null
        },
        isAuthenticated: (state) => {
            return state.user !== null
        }
    },
    actions: {
        async login(email: string, password: string) {
            try {
                const res = await http.post<AuthResponse>('/auth/login', {
                    email,
                    password
                })
                if (res.status === HttpStatusCode.Ok) {
                    const { id, name, email, role, accessToken, signature } =
                        res.data
                    this.user = {
                        id,
                        name,
                        email,
                        role,
                        accessToken,
                        signature
                    }
                }
                return res
            } catch (err) {
                this.user = null
                if (axios.isAxiosError(err)) {
                    throw err
                }
                throw err
            }
        },
        async register(email: string, password: string, name: string) {
            try {
                const res = await http.post<RegisterResponse>(
                    '/auth/register',
                    {
                        email,
                        password,
                        name
                    }
                )
                return res
            } catch (err) {
                if (axios.isAxiosError<ErrorResponse>(err)) {
                    throw err
                }
                throw err
            }
        },
        async logout() {
            this.user = null
            return true
        }
    },
    persist: true
})
