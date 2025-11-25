import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    searchQuery: '',
    categoryFilter: ''
  }),
  getters: {
    filteredProducts: (state) => {
      let filtered = state.products

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        )
      }

      if (state.categoryFilter) {
        filtered = filtered.filter(
          (product) => product.category.toLowerCase() === state.categoryFilter.toLowerCase()
        )
      }
      return filtered
    }
  },
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/products`)
        this.products = response.data.products
      } catch (error) {
        this.error = 'Failed to fetch products.'
      } finally {
        this.loading = false
      }
    },
    async fetchProductById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`)
        this.product = response.data
      } catch (error) {
        this.error = `Failed to fetch product ${id}.`
      } finally {
        this.loading = false
      }
    },
    async addProduct(newProduct) {
      this.loading = true
      try {
        const response = await axios.post(`${API_BASE_URL}/products/add`, newProduct)
        // client side add simulation
        this.products.unshift({ ...response.data, id: Date.now() }) 
        return true
      } catch (error) {
        this.error = 'Failed to add product.'
        return false
      } finally {
        this.loading = false
      }
    },
    async updateProduct(id, updatedData) {
      this.loading = true
      try {
        // API Call
        await axios.put(`${API_BASE_URL}/products/${id}`, updatedData)
        
        // client side update)
        const index = this.products.findIndex(p => p.id == id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedData }
        }
        // if update is current showing product
        if (this.product && this.product.id == id) {
          this.product = { ...this.product, ...updatedData }
        }
        return true
      } catch (error) {
        this.error = 'Failed to update product.'
        return false
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(id) {
        this.loading = true
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`)
            
            // client side delete
            this.products = this.products.filter(p => p.id !== id)
            return true
        } catch (error) {
            this.error = 'Failed to delete product.'
            return false
        } finally {
            this.loading = false
        }
    },
    setSearchQuery(query) { this.searchQuery = query },
    setCategoryFilter(category) { this.categoryFilter = category }
  }
})