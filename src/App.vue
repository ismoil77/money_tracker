<template>
  <div class="app-shell" :class="{ loaded: settingsStore.loaded }">
    <!-- Toasts -->
    <div class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast-item', t.type]"
      >
        <span>{{ t.type === 'error' ? '✕' : '✓' }}</span>
        {{ t.msg }}
      </div>
    </div>

    <!-- Page Content -->
    <main class="app-container">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation (Mobile-first) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.js'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { usePlanStore } from '@/stores/planStore.js'
import { useToast } from '@/composables/useToast.js'
import BottomNav from '@/components/BottomNav.vue'

const settingsStore = useSettingsStore()
const txStore = useTransactionStore()
const planStore = usePlanStore()
const { toasts } = useToast()

onMounted(async () => {
  // Init theme immediately
  document.documentElement.setAttribute('data-theme', settingsStore.theme)
  // Load all data in parallel
  await Promise.all([
    settingsStore.loadFromServer(),
    txStore.fetchAll(),
    planStore.fetchAll(),
  ])
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.app-shell {
  opacity: 0;
  transition: opacity 0.3s;
}
.app-shell.loaded {
  opacity: 1;
}
</style>
