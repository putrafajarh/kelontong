import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@stores/auth'
import { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
    // eslint-disable-next-line no-unused-vars
    interface RouteMeta {
        layout: string
        requiresAuth?: boolean
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@pages/Home.vue'),
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@pages/Login.vue'),
            meta: {
                guest: true,
                layout: 'AppLayoutGuest'
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@pages/Register.vue'),
            meta: {
                guest: true,
                layout: 'AppLayoutGuest'
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@pages/Profile.vue'),
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/product',
            name: 'product',
            component: () => import('@pages/Product.vue'),
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/product/:id',
            name: 'product-detail',
            component: () => import('@pages/ProductDetail.vue'),
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/product/create',
            name: 'product-create',
            component: () => import('@pages/ProductCreate.vue'),
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'PageNotFound',
            component: () => import('@pages/PageNotFound.vue'),
            meta: {
                layout: 'AppLayoutAdmin'
            }
        }
    ]
})

async function loadLayoutMiddleware(route: RouteLocationNormalized) {
    try {
        const layout = route.meta.layout
        let layoutComponent = await import(`./layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    } catch (e) {
        console.error('Error occurred in processing of layouts: ', e)
        let layout = 'AppLayoutDefault'
        let layoutComponent = await import(`./layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    }
}

router.beforeEach(loadLayoutMiddleware)
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            next({
                name: 'login',
                query: { redirectTo: to.fullPath }
            })
        } else {
            next()
        }
    }
    if (to.matched.some((record) => record.meta.guest)) {
        const auth = useAuthStore()
        if (auth.isAuthenticated) {
            next({ path: '/' })
        } else {
            next()
        }
    }
})

export default router
