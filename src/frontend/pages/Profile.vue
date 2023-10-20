<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router'

import { useAuthStore } from '@stores/auth';
import router from '@/router';


const auth = useAuthStore();
</script>

<template>
  <div class="overflow-scroll">
    <pre>{{  auth.user }}</pre>
  </div>
</template>