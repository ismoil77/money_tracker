import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api.js'

export const usePlanStore = defineStore('plans', () => {
  const items = ref([])

  function getByCategory(category) {
    return items.value.find(p => p.category === category)
  }

  function getAmount(category) {
    const plan = getByCategory(category)
    return plan ? Number(plan.amount) || 0 : 0
  }

  async function fetchAll() {
    try {
      const data = await api.getPlans()
      items.value = Array.isArray(data) ? data : []
    } catch {
      items.value = []
    }
  }

  async function upsert(category, amount) {
    const numAmount = Math.round(Number(amount) * 100) / 100
    const existing = getByCategory(category)
    if (existing) {
      const updated = await api.updatePlan(existing.id, { amount: numAmount })
      const idx = items.value.findIndex(p => p.id === existing.id)
      if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updated }
    } else {
      const created = await api.createPlan({ category, amount: numAmount })
      items.value.push(created)
    }
  }

  return { items, getByCategory, getAmount, fetchAll, upsert }
})
