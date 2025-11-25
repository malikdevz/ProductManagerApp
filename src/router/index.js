import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue' // Renommée pour Dashboard ou une page de bienvenue
import LoginView from '../views/LoginView.vue'
import ProductListView from '../views/ProductListView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AddProductView from '../views/AddProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products' // Redirige la racine vers la liste des produits
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'auth' } // Indique que cette route utilise le layout d'authentification
    },
    {
      path: '/dashboard', // Ajout d'une route pour le tableau de bord
      name: 'dashboard',
      component: HomeView, // On utilise HomeView comme placeholder pour le dashboard
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-product',
      name: 'add-product',
      component: AddProductView,
      meta: { requiresAuth: true }
    },
    // Routes pour Orders et Customers peuvent être ajoutées ici
    {
      path: '/orders',
      name: 'orders',
      component: { template: '<div class="text-2xl font-bold">Orders Page (Coming Soon)</div>' },
      meta: { requiresAuth: true }
    },
    {
      path: '/customers',
      name: 'customers',
      component: { template: '<div class="text-2xl font-bold">Customers Page (Coming Soon)</div>' },
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: { template: '<div class="text-2xl font-bold">Settings Page (Coming Soon)</div>' },
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log("Navigation vers :", to.path)
  console.log("Page protégée ?", to.meta.requiresAuth)
  console.log("Est connecté ?", authStore.isAuthenticated)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log("⛔ BLOQUÉ : Redirection vers Login")
    next('/login')
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    console.log("⏩ DÉJÀ CONNECTÉ : Redirection vers Products")
    next('/products') // Empêche l'utilisateur connecté d'aller sur la page de connexion
  }
  else {
    next()
  }
})

export default router