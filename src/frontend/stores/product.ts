import { defineStore } from 'pinia'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import http from '@/axios'

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
    image?: string
    createdAt: string
    updatedAt: string
    categoryId?: string
    userId: string
    user: UserData
    category?: CategoryData
}

export interface ErrorResponse {
    status: string
    message: string
    name?: string
    errors?: string[] | string
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
        product: undefined as ProductData | undefined
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
                        lastPage: parseInt(res.headers['x-last-page'])
                    }
                    this.products = res.data
                }
            } catch (err) {
                this.products = []
            }
        },
        async getProductById(id: string) {
            try {
                // using axios createProduct multipart-form-data
                // const res = await http.get<ProductData>(`/product/${id}`)
                const res = await http.get<ProductData>(`/product/${id}`)
                if (res.status === HttpStatusCode.Ok) {
                    this.product = res.data
                }
            } catch (err) {
                this.product = undefined
            }
        },
        async createProduct(product: any, imageData: File | null) {
            try {
                const formData = new FormData()
                formData.append('name', product.name)
                formData.append('sku', product.sku)
                formData.append('description', product.description)
                formData.append('price', product.price)
                if (product.weight)
                    formData.append('weight', product.weight.toString())
                if (product.width)
                    formData.append('width', product.width.toString())
                if (product.length)
                    formData.append('length', product.length.toString())
                if (product.height)
                    formData.append('height', product.height.toString())
                if (imageData) formData.append('image', imageData)
                formData.append('userId', product.userId)

                // Display the key/value pairs
                for (var pair of formData.entries()) {
                    console.log(pair[0] + ', ' + pair[1])
                }

                const res = await http.post<ProductData>(`/product`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                return res
            } catch (err) {
                console.error(err)
                if (axios.isAxiosError<ErrorResponse>(err)) {
                    throw err
                }
                throw err
            }
        }
    }
})
