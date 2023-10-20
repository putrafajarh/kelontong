<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router'

import { useAuthStore } from '@stores/auth';
import { useProductStore } from '../stores/product';
import router from '@/router';


const auth = useAuthStore();
const productStore = useProductStore();
const route = useRoute()

const page = parseInt(route.query.page as string) || undefined
const perPage = parseInt(route.query.perPage as string) || undefined

onMounted(async() => {
  await productStore.getAllProducts(page, perPage);
  const products = productStore.products;
})

const handleLogout = async() => {
  await auth.logout();
  router.push({
      path: '/login',
      query: {
          redirectTo: route.fullPath
      }
  })
}
</script>

<template>
  <div class="overflow-scroll">
    <pre>{{  auth.user }}</pre>
  </div>
  <div class="mt-8">
    <button @click.prevent="handleLogout" class="bg-red-600 text-white font-bold px-4 py-2 rounded-md">Logout</button>
  </div>
  <div class="flex flex-wrap">
    <div v-for="product in productStore.products" :key="product.id" class="w-1/4 p-2">
      <div class="bg-white shadow-md rounded-md p-4">
        <div class="flex justify-between">
          <div class="font-bold">{{ product.name }}</div>
        </div>
        <div class="text-sm">{{ product.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
