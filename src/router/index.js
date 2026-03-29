import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/user' },
    { path: '/user', component: () => import('../views/user/UserChat.vue') },
    { path: '/admin', component: () => import('../views/admin/AdminManage.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router