import axios from 'axios'
import { HttpStatusCode } from 'axios'
import { useAuthStore } from '@stores/auth'
import router from '@/router'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: 'application/json'
    }
})

http.interceptors.request.use(
    (config) => {
        const auth = useAuthStore()
        config.headers['X-Access-Token'] = auth.accessToken
        config.headers['X-Signature'] = auth.signature
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    (response) => {
        console.log('interceptor: response')
        return response
    },
    (error) => {
        console.log('interceptor: error', error)
        if (error.config.url === '/auth/login') {
            return Promise.reject(error)
        }

        const auth = useAuthStore()
        if (error.response.status === HttpStatusCode.Unauthorized) {
            auth.logout().then(() => {
                router.push({
                    path: '/login',
                    query: {
                        redirectTo: router.currentRoute.value.fullPath
                    }
                })
            })
        }
        return Promise.reject(error)
    }
)

export default http
