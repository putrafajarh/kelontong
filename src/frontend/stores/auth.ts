import { defineStore } from 'pinia'
import axios, { HttpStatusCode } from "axios";
import http from '../axios'
import router from '@/router';
import { useRoute } from 'vue-router';

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
    errors?: string[]|string
}

export interface AuthResponse {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
    signature: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null,
    }),
    getters: {
        accessToken: (state) => {
            return state.user ? state.user.accessToken : null
        },
        signature: (state) => {
            return state.user ? state.user.signature : null;
        },
        isAuthenticated: (state) => {
            return state.user !== null
        },
    },
    actions: {
        async login(email: string, password: string) {
            console.log('login')
            try {
                const res = await http.post<AuthResponse>('/auth/login', {
                    email,
                    password
                })
                if (res.status === HttpStatusCode.Ok) {
                    const { id, name, email, role, accessToken, signature } = res.data
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
        async logout() {
            this.user = null
            return true;
        }
    },
    persist: true
})