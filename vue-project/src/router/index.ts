import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    // Catchall — matches any unmatched path
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import('../views/NotFoundView.vue')
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to, from) => {
//   const authStore = useAuthStore();

//   // List of routes that require authentication
//   const nonProtectedRoutes = ["Login", "Register"];

//   if (!nonProtectedRoutes.includes(to.name as string) && !authStore.isLoggedIn()) {
//     return { name: "Login" };
//   }
// });

export default router
