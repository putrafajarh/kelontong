import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from './components/Auth/Login.vue';
import ProfileVue from '@pages/Profile.vue';
import PageNotFound from '@pages/PageNotFound.vue';
import Product from '@pages/Product.vue';
import ProductDetail from '@pages/ProductDetail.vue';
import Home from '@pages/Home.vue';
// import PageNotFound from './components/PageNotFound.vue'
import { useAuthStore } from '@stores/auth';
import { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        layout: string 
        requiresAuth?: boolean
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginVue,
            meta: {
                guest: true,
                layout: 'AppLayoutGuest'
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileVue,
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin',
            }
        },
        {
            path: '/product',
            component: Product,
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/product/:id',
            name: 'product-detail',
            component: ProductDetail,
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/',
            component: Home,
            meta: {
                requiresAuth: true,
                layout: 'AppLayoutAdmin'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: PageNotFound,
            meta: {
                layout: 'AppLayoutGuest'
            }
        },
    ],
});

async function loadLayoutMiddleware(route: RouteLocationNormalized) {
    try {
        const layout = route.meta.layout
        console.log('loadLayoutMiddleware', layout)
        let layoutComponent = await import(`./layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    } catch (e) {
        console.error('Error occurred in processing of layouts: ', e)
        console.log('Mounted default layout AppLayoutDefault')
        let layout = 'AppLayoutDefault'
        let layoutComponent = await import(`./layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    }
}

router.beforeEach(loadLayoutMiddleware)
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        console.log('middleware: AUTH')
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            next({
                name: 'login',
                query: { redirectTo: to.fullPath }
            })
        } else {
            next();
        }
    }
    if (to.matched.some(record => record.meta.guest)) {
        console.log('middleware: GUEST')
        const auth = useAuthStore()
        if (auth.isAuthenticated) {
            next({ path: '/' });
        } else {
            next();
        }
    }
  })

export default router;