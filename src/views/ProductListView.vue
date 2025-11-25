<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '../stores/product'
import { RouterLink } from 'vue-router'
import {useRouter } from 'vue-router'

const router = useRouter()

const productStore = useProductStore()

const localSearchQuery = ref(productStore.searchQuery)
const localCategoryFilter = ref(productStore.categoryFilter)
const localStockFilter = ref(productStore.stockFilter)
const activeMenuId = ref(null)
const showDeleteModal = ref(false)
const productToDelete = ref(null)

// --- CONFIGURATION PAGINATION ---
const currentPage = ref(1)
const itemsPerPage = 4

const categories = [
  'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration'
]

const applySearch = () => {
  productStore.setSearchQuery(localSearchQuery.value)
  currentPage.value = 1 // back to pagination 1
}

const applyCategoryFilter = () => {
  productStore.setCategoryFilter(localCategoryFilter.value)
  currentPage.value = 1 // back to pagination 1
}

// --- LOGIC PAGINATION ---
const totalPages = computed(() => {
  return Math.ceil(productStore.filteredProducts.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return productStore.filteredProducts.slice(start, end)
})

// Calcul display index "Showing X to Y"
const startIndex = computed(() => ((currentPage.value - 1) * itemsPerPage) + 1)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage - 1, productStore.filteredProducts.length))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// --- UTILS ---
const getStockStatus = (stock) => {
  if (stock > 50) return 'In Stock';
  if (stock > 0) return 'Low Stock';
  return 'Out of Stock';
}

const getStockColorClass = (stock) => {
  if (stock > 50) return 'text-green-600';
  if (stock > 0) return 'text-orange-500';
  return 'text-red-600';
}

const applyStockFilter = () => {
  productStore.setStockFilter(localStockFilter.value)
  currentPage.value = 1 
}

// on click on item
const goToDetail = (id) => {
  router.push(`/products/${id}`)
}

// context menu
const toggleMenu = (id) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null
  } else {
    activeMenuId.value = id
  }
}

// Actions Edit / Delete
const handleEdit = (id) => {
  activeMenuId.value = null
  router.push(`/add-product?id=${id}`) 
}

const confirmDelete = (product) => {
  activeMenuId.value = null
  productToDelete.value = product
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (productToDelete.value) {
    await productStore.deleteProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    // if pagination index no longer exist
    if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
    }
  }
}


onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>

<template>

  <div class="h-full flex flex-col overflow-hidden pb-6">
    
    <!-- header -->
    <div class="flex-none">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Products</h1>
          <p class="text-gray-600">Manage your inventory and view product performance.</p>
          
        </div>
        <RouterLink to="/add-product" class="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-md transition-colors duration-200">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
          Add New Product
        </RouterLink>
      </div>
      <p class="text-xs text-gray-600 text-red-500">Note: The product added or edited on the client side may cause errors when viewing the details because it is not a real addition or modification. It’s a client-side simulation, since DummyJSON does not allow actual data creation or updates. Therefore, deleting, adding, and modifying products are only simulations. Thank you.</p>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
          <input
            type="text"
            v-model="localSearchQuery"
            @input="applySearch"
            placeholder="Search by product name..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <select
          v-model="localCategoryFilter"
          @change="applyCategoryFilter"
          class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:w-48"
        >
          <option value="">Category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') }}
          </option>
        </select>
        
        <select
          v-model="localStockFilter"
          @change="applyStockFilter"
          class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:w-48"
        >
          <option value="">All Stock Status</option>
          <option value="in_stock">In Stock (> 50)</option>
          <option value="low_stock">Low Stock (1-50)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </select>
      </div>
    </div>


    <div class="flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow-md overflow-hidden">
      
      <!-- state Loading / Error -->
      <div v-if="productStore.loading" class="text-center text-gray-500 text-lg py-10">
        Loading products...
      </div>
      <div v-else-if="productStore.error" class="text-center text-red-500 text-lg py-10">
        {{ productStore.error }}
      </div>
      <div v-else-if="productStore.filteredProducts.length === 0" class="text-center text-gray-600 text-lg py-10">
        No products found matching your criteria.
      </div>

    
      <div v-else class="flex-1 overflow-y-auto hide-scrollbar">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          
            <tr v-for="product in paginatedProducts" :key="product.id" @click="goToDetail(product.id)" class="hover:bg-gray-50 transition-colors cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap">
                <RouterLink :to="`/products/${product.id}`" class="flex items-center group">
                  <img :src="product.thumbnail" :alt="product.title" class="h-10 w-10 rounded-full object-cover mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                    <div class="text-sm text-gray-500 line-clamp-1 max-w-[150px]">{{ product.description }}</div>
                  </div>
                </RouterLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="h-2 w-2 rounded-full mr-2" :class="{
                    'bg-green-500': getStockStatus(product.stock) === 'In Stock',
                    'bg-orange-400': getStockStatus(product.stock) === 'Low Stock',
                    'bg-red-500': getStockStatus(product.stock) === 'Out of Stock'
                  }"></span>
                  <span class="text-sm" :class="getStockColorClass(product.stock)">{{ product.stock }} {{ getStockStatus(product.stock) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                
                <button @click.stop="toggleMenu(product.id)" class="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                </button>

                <!-- CONTEXT MENU DROPDOWN -->
                <div v-if="activeMenuId === product.id" class="absolute right-8 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1 text-left">
                    <button @click.stop="handleEdit(product.id)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                    </button>
                    <button @click.stop="confirmDelete(product)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Delete
                    </button>
                </div>
                
                <div v-if="activeMenuId === product.id" @click.stop="activeMenuId = null" class="fixed inset-0 z-40 cursor-default"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="productStore.filteredProducts.length > 0" class="flex-none px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ startIndex }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ productStore.filteredProducts.length }}</span> results
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.293a1 1 0 010 1.414L9.414 10l3.376 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            <span class="ml-1 hidden sm:inline">Prev</span>
          </button>
          
          <div class="flex items-center px-2 text-sm text-gray-600 font-medium">
            Page {{ currentPage }} / {{ totalPages }}
          </div>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="mr-1 hidden sm:inline">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.707a1 1 0 010-1.414L10.586 10 7.21 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </div>
    </div>

     <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete <span class="font-semibold">"{{ productToDelete?.title }}"</span>? This action cannot be undone.</p>
            <div class="flex justify-end space-x-3">
                <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button @click="executeDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}


.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>