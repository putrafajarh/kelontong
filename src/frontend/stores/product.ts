import { defineStore } from 'pinia'
import axios, { HttpStatusCode } from "axios";
import http from '../axios'


enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
export interface UserData {
    id: string
    email: string
    name: string
    role: Role
    createdAt: string
    updatedAt: string
}

export interface CategoryData {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface ProductData {
    id: string
    name: string
    sku: string
    description: string
    price: string
    weight: number
    width?: number
    length?: number
    height?: number
    image: string
    createdAt: string
    updatedAt: string
    categoryId?: string
    userId: string
    user: UserData
    category?: CategoryData
}

export interface PaginationData {
    page: number
    perPage: number
    total: number
    lastPage: number
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as ProductData[],
        pagination: {} as PaginationData,
        product: undefined as ProductData | undefined,
    }),
    getters: {},
    actions: {
        async getAllProducts(page: number = 1, perPage: number = 20) {
            try {
                const res = await http.get<ProductData[]>('/product', {
                    params: {
                        page,
                        perPage
                    }
                })
                if (res.status === HttpStatusCode.Ok) {
                    this.pagination = {
                        page: parseInt(res.headers['x-current-page']),
                        perPage: parseInt(res.headers['x-per-page']),
                        total: parseInt(res.headers['x-total-count']),
                        lastPage: parseInt(res.headers['x-last-page']),
                    }
                    this.products = res.data
                }
            } catch (err) {
                this.products = []
            }
        },
        async getProductById(id: string) {
            try {
                const res = await http.get<ProductData>(`/product/${id}`)
                if (res.status === HttpStatusCode.Ok) {
                    this.product = res.data
                }
            } catch (err) {
                this.product = undefined
            }
        }
    },
})