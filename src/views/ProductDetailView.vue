<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const showDeleteModal = ref(false)



const handleEdit = () => {
    //redirect user to product detail
    router.push(`/add-product?id=${productStore.product.id}`)
}

const confirmDelete = () => {
    showDeleteModal.value = true
}

const executeDelete = async () => {
    await productStore.deleteProduct(productStore.product.id)
    showDeleteModal.value = false
    router.push('/products') 
}

const getRatingStars = (rating) => {
  //process rating stars
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return { fullStars, halfStar, emptyStars };
};

onMounted(() => {
  //try to fetch product if we are editing
  productStore.fetchProductById(route.params.id)
})
</script>

<template>
  <div class="pb-6">
    <div class="text-sm breadcrumbs mb-6 text-gray-600">
      <ul>
        <li><RouterLink to="/products" class="text-indigo-600 hover:text-indigo-800">Products</RouterLink></li>
        <li>{{ productStore.product ? productStore.product.title : 'Loading...' }}</li>
      </ul>
    </div>

    <div v-if="productStore.loading" class="text-center text-gray-500 text-lg py-10 bg-white rounded-lg shadow-sm">
      Loading product details...
    </div>
    <div v-else-if="productStore.error" class="text-center text-red-500 text-lg py-10 bg-white rounded-lg shadow-sm">
      {{ productStore.error }}
    </div>
    <div v-else-if="productStore.product" class="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left: Product Image -->
      <div>
        <img
          :src="productStore.product.thumbnail"
          :alt="productStore.product.title"
          class="w-full max-h-96 object-contain rounded-md mb-4 border border-gray-200"
        />
        <div class="grid grid-cols-4 gap-2">
          <img
            v-for="(image, index) in productStore.product.images"
            :key="index"
            :src="image"
            alt="Product Image"
            class="w-full h-20 object-cover rounded-sm cursor-pointer border border-gray-200 hover:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <!-- Right: Product Details -->
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ productStore.product.title }}</h1>
        <p class="text-gray-600 text-lg mb-4">{{ productStore.product.description }}</p>

        <!-- BOUTONS ACTIONS -->
        <div class="flex space-x-3 mb-6">
            <button @click="handleEdit" class="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                Edit
            </button>
            <button @click="confirmDelete" class="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                Delete
            </button>
        </div>

        <div class="grid grid-cols-2 gap-y-3 mb-6">
          <div>
            <span class="font-semibold text-gray-700 block">Price</span>
            <span class="text-3xl font-bold text-indigo-700">${{ productStore.product.price.toFixed(2) }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-700 block">Category</span>
            <span class="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded-full mt-1 inline-block">
              {{ productStore.product.category.charAt(0).toUpperCase() + productStore.product.category.slice(1).replace('-', ' ') }}
            </span>
          </div>
          <div>
            <span class="font-semibold text-gray-700 block">Stock</span>
            <div class="flex items-center mt-1">
              <span class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
              <span class="text-lg text-gray-800 font-medium">{{ productStore.product.stock }} units</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <span class="font-semibold text-gray-700 block mb-2">Description</span>
          <p class="text-gray-700 leading-relaxed">{{ productStore.product.description }}</p>
        </div>

        <!-- Customer Reviews section -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div class="flex items-center mb-4">
            <span class="text-4xl font-bold text-gray-800 mr-2">{{ productStore.product.rating }}</span>
            <div class="flex">
              <template v-for="n in getRatingStars(productStore.product.rating).fullStars" :key="'full-' + n">
                <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.722c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
              </template>
              <template v-if="getRatingStars(productStore.product.rating).halfStar">
                <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.722c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292zM10 15.292V4.457l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.722c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69L10 4.457z" clip-rule="evenodd"></path></svg>
              </template>
              <template v-for="n in getRatingStars(productStore.product.rating).emptyStars" :key="'empty-' + n">
                <svg class="h-6 w-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.722c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
              </template>
            </div>
          </div>
          <p class="text-sm text-gray-500">Based on 120 reviews</p>

          <!-- Rating distribution (mock data) -->
          <div class="mt-4 space-y-2">
            <div class="flex items-center">
              <span class="text-sm text-gray-700 w-8">5</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 75%;"></div>
              </div>
              <span class="text-sm text-gray-700">75%</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 w-8">4</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 15%;"></div>
              </div>
              <span class="text-sm text-gray-700">15%</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 w-8">3</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 5%;"></div>
              </div>
              <span class="text-sm text-gray-700">5%</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 w-8">2</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 3%;"></div>
              </div>
              <span class="text-sm text-gray-700">3%</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 w-8">1</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 2%;"></div>
              </div>
              <span class="text-sm text-gray-700">2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-sm">
      Product not found.
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p class="text-gray-600 mb-6">Are you sure?</p>
            <div class="flex justify-end space-x-3">
                <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button @click="executeDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
        </div>
    </div>
  </div>
</template>