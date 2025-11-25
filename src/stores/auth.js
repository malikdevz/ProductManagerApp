import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('userToken') || null, // Persist token in local storage
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => {
      if (state.token) return true;
      return !!localStorage.getItem('userToken');
    }
  },
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          username,
          password
        })
        this.user = response.data
        this.token = response.data.token
        localStorage.setItem('userToken', this.token) // Save token
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}` // Set default auth header
        return true
      } catch (error) {
        this.error = 'Login failed. Please check your credentials.'
        console.error('Login error:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('userToken') // Remove token
      delete axios.defaults.headers.common['Authorization'] // Remove auth header
    },
    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        // Optionally, you could try to fetch user details with the token to validate it
      }
    }
  }
})