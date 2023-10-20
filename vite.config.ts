import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: fileURLToPath(
                    new URL('./src/frontend', import.meta.url)
                )
            },
            {
                find: '@assets',
                replacement: fileURLToPath(
                    new URL('./src/frontend/assets', import.meta.url)
                )
            },
            {
                find: '@cmp',
                replacement: fileURLToPath(
                    new URL('./src/frontend/components', import.meta.url)
                )
            },
            {
                find: '@stores',
                replacement: fileURLToPath(
                    new URL('./src/frontend/stores', import.meta.url)
                )
            },
            {
                find: '@use',
                replacement: fileURLToPath(
                    new URL('./src/frontend/use', import.meta.url)
                )
            },
            {
                find: '@shared',
                replacement: fileURLToPath(
                    new URL('./src/shared', import.meta.url)
                )
            },
            {
                find: '@pages',
                replacement: fileURLToPath(
                    new URL('./src/frontend/pages', import.meta.url)
                )
            }
        ]
    }
})
