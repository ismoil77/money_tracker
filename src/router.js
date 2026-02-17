import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('./views/DashboardView.vue') },
  { path: '/transactions', name: 'transactions', component: () => import('./views/TransactionsView.vue') },
  { path: '/add', name: 'add', component: () => import('./views/AddTransactionView.vue') },
  { path: '/edit/:id', name: 'edit', component: () => import('./views/AddTransactionView.vue') },
  { path: '/settings', name: 'settings', component: () => import('./views/SettingsView.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
