import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('../views/user/UserLogin.vue') },
    { path: '/register', component: () => import('../views/user/UserRegister.vue') },
    { path: '/admin/login', component: () => import('../views/admin/AdminLogin.vue') },
    { path: '/user', component: () => import('../views/user/UserChat.vue') },
    { path: '/admin', component: () => import('../views/admin/AdminManage.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router