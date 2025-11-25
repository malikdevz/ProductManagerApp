<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const logout = () => {
  authStore.logout()
  router.push('/login')
}


const isDashboardLayout = computed(() => {
  return route.meta.layout !== 'auth';
});

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <div v-if="isDashboardLayout" class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-center mb-10">
          <svg class="h-8 w-8 text-indigo-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <span class="ml-2 text-xl font-bold text-gray-800">Product Management</span>
        </div>
        <nav>
          <ul>
            <li class="mb-2">
              <RouterLink to="/dashboard" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200" :class="{ 'bg-indigo-100 text-indigo-700 font-semibold': route.path === '/dashboard' }">
                <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H2z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                Dashboard
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/products" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200" :class="{ 'bg-indigo-100 text-indigo-700 font-semibold': route.path.startsWith('/products') }">
                <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path></svg>
                Products
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/orders" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2V1a1 1 0 012 0v2h2V1a1 1 0 012 0v2h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
                Orders
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/customers" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                Customers
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Settings and Logout -->
      <div>
        <ul>
          <li class="mb-2">
            <RouterLink to="/settings" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200">
              <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.3-.837-2.788.756-1.546 2.072.582.62.287 1.49-.572 1.838-1.36.547-1.36 2.41 0 2.957.859.348 1.154 1.217.572 1.838-1.242 1.316.246 2.913 1.546 2.072a1.532 1.532 0 012.284.947c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.3.837 2.788-.756 1.546-2.072-.582-.62-.287-1.49.572-1.838 1.36-.547 1.36-2.41 0-2.957-.859-.348-1.154-1.217-.572-1.838 1.242-1.316-.246-2.913-1.546-2.072a1.532 1.532 0 01-2.284-.947zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
              Settings
            </RouterLink>
          </li>
          <li>
            <button @click="logout" class="flex items-center p-3 w-full text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors duration-200">
              <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow-sm p-4 flex items-center justify-end">
        <!-- Top right user icon and notifications -->
        <div class="flex items-center space-x-4">
          <button class="text-gray-500 hover:text-gray-700 relative">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
          </button>
          <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">JD</div>
        </div>
      </header>
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Auth Layout (Login Page) -->
  <div v-else class="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
    <RouterView />
  </div>
</template>