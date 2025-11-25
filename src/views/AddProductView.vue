<script setup>
import { ref, onMounted, computed } from 'vue'
import {useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'

const router = useRouter()
const store = useProductStore()
const route = useRoute()

// Mode Edition si un ID est présent dans l'URL (ex: /add-product?id=12)
const isEditMode = computed(() => !!route.query.id)
const productId = route.query.id

const form = ref({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  thumbnail: 'https://via.placeholder.com/150'
})

const successMessage = ref('')

const categories = [
  'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home decoration','beauty','Apparel','Furniture'
]


const handleSubmit = async () => {
  let success = false
  if (isEditMode.value) {
    success = await store.updateProduct(productId, form.value)
  } else {
    success = await store.addProduct(form.value)
  }

  if (success) {
    router.push('/products')
  }
}


const handleCancel = () => {
  router.push('/products');
}
onMounted(async () => {
  if (isEditMode.value) {
    // Si on a les données en cache, on peut les prendre, sinon on fetch
    if (!store.product || store.product.id != productId) {
      await store.fetchProductById(productId)
    }
    // Remplissage du formulaire
    if (store.product) {
      form.value = { ...store.product }
    }
  }
})
</script>

<template>
  <div class="pb-6">
     <h1 class="text-2xl font-bold mb-6 text-gray-800">
        {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
    </h1>
    <p class="text-gray-600 mb-6">Enter the details below to add a new item to your inventory.</p>

    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      <form @submit.prevent="handleSubmit">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Product Information</h2>
        <div class="mb-6">
          <label for="title" class="block text-gray-700 text-sm font-semibold mb-2">Product Title</label>
          <input
            type="text"
            id="title"
            v-model="form.title"
            placeholder="Enter product title"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div class="mb-6">
          <label for="description" class="block text-gray-700 text-sm font-semibold mb-2">Product Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            placeholder="Provide a detailed description of the product"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-8">Pricing & Inventory</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="price" class="block text-gray-700 text-sm font-semibold mb-2">Price</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                v-model.number="form.price"
                placeholder="0.00"
                class="pl-8 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label for="stock" class="block text-gray-700 text-sm font-semibold mb-2">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              v-model.number="form.stock"
              placeholder="Enter stock quantity"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="0"
            />
          </div>
        </div>

        <div class="mb-6">
          <label for="category" class="block text-gray-700 text-sm font-semibold mb-2">Category</label>
          <select
            id="category"
            v-model="form.category"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') }}
            </option>
          </select>
        </div>

        <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-8">Media</h2>
        <div class="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
          <input type="file" class="hidden" id="file-upload" multiple />
          <label for="file-upload" class="flex flex-col items-center justify-center h-full w-full">
            <svg class="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <p class="text-indigo-600 font-medium">Click to upload</p>
            <p class="text-gray-500 text-sm">or drag and drop</p>
            <p class="text-gray-400 text-xs mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </label>
        </div>

        <div v-if="store.error" class="text-red-500 text-sm mb-4 text-center">
          {{ store.error }}
        </div>
        <div v-if="successMessage" class="text-green-600 text-sm mb-4 text-center">
          {{ successMessage }}
        </div>
        <div class="flex justify-end space-x-4 mt-8">
          <button type="button" @click="handleCancel" class="mr-4 px-4 py-2 text-gray-700 hover:text-gray-900 pointer-cursor">Cancel</button>
         <button type="submit" :disabled="store.loading" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {{ store.loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
         </button>
        </div>
      </form>
    </div>
  </div>
</template>