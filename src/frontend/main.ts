import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import icon from './components/SvgIcon.vue'
import router from '@/router'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const head = createHead()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(head)

app.component('Icon', icon)

app.mount('#app')
