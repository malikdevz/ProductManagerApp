<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('emilys') // Dummy credentials for dummyjson.com
const password = ref('emilyspass')   // Dummy credentials for dummyjson.com
const showPassword = ref(false)

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    console.log("Login reussi redirect.....")
    router.push('/products')
    console.log("Redirection demandée")
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-2">
      <svg class="h-10 w-10 text-indigo-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
      <span class="ml-2 text-2xl font-bold text-gray-800">Platform Logo</span>
    </div>
  
  </div>

  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
    <p class="text-gray-600 mb-6 text-center">Sign in to manage your products.</p>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-semibold mb-2">Email or Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="you@example.com"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            required
          />
          <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
            <svg v-if="showPassword" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 7H5a1 1 0 000 2h3a1 1 0 001-1V5a1 1 0 00-2 0v1.586l-1.293-1.293a1 1 0 00-1.414 0zM17 11a1 1 0 100-2h-1.586l-2.293-2.293a1 1 0 10-1.414 1.414L13.414 9H15a1 1 0 000-2h-2.586l-1.293-1.293a1 1 0 10-1.414 1.414L10.586 9H8.707L7.293 7.586A1 1 0 105.88 9H3a1 1 0 100 2h1.586l1.293 1.293a1 1 0 101.414 0L8.414 11H10.293l1.414 1.414a1 1 0 001.414 0L14.586 11H17z" clip-rule="evenodd"></path></svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <input type="checkbox" id="rememberMe" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">Forgot Password?</a>
      </div>
      <div v-if="authStore.error" class="text-red-500 text-sm mb-4 text-center">
        {{ authStore.error }}
      </div>
      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
  <p class="mt-8 text-sm text-gray-500">&copy; 2024 Platform Inc. All Rights Reserved.</p>
</div>
</template>