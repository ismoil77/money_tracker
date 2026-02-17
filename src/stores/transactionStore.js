import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api.js'

export const useTransactionStore = defineStore('transactions', () => {
  // ═══ STATE ═══
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ═══ GETTERS ═══
  const incomes = computed(() => items.value.filter(t => t.type === 'income'))
  const expenses = computed(() => items.value.filter(t => t.type === 'expense'))

  /**
   * Filter transactions by year + month of a given Date object.
   */
  function byMonth(date) {
    const y = date.getFullYear()
    const m = date.getMonth()
    return items.value.filter(t => {
      const d = new Date(t.date)
      return d.getFullYear() === y && d.getMonth() === m
    })
  }

  function monthIncomes(date) {
    return byMonth(date).filter(t => t.type === 'income')
  }

  function monthExpenses(date) {
    return byMonth(date).filter(t => t.type === 'expense')
  }

  function sumByField(list) {
    return list.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  }

  function getById(id) {
    return items.value.find(t => t.id === Number(id) || t.id === id)
  }

  // ═══ ACTIONS ═══
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const data = await api.getTransactions()
      items.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const cleaned = {
      date: payload.date,
      type: payload.type,
      category: payload.category,
      subcategory: payload.subcategory || '',
      amount: Math.round(Number(payload.amount) * 100) / 100,
      source: payload.type === 'income' ? payload.source : '',
      comment: payload.comment || '',
      createdAt: new Date().toISOString(),
    }
    const created = await api.createTransaction(cleaned)
    items.value.push(created)
    return created
  }

  async function update(id, payload) {
    const cleaned = {
      date: payload.date,
      type: payload.type,
      category: payload.category,
      subcategory: payload.subcategory || '',
      amount: Math.round(Number(payload.amount) * 100) / 100,
      source: payload.type === 'income' ? payload.source : '',
      comment: payload.comment || '',
    }
    const updated = await api.updateTransaction(id, cleaned)
    const idx = items.value.findIndex(t => t.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updated }
    return updated
  }

  async function remove(id) {
    await api.deleteTransaction(id)
    items.value = items.value.filter(t => t.id !== id)
  }

  return {
    items, loading, error,
    incomes, expenses,
    byMonth, monthIncomes, monthExpenses, sumByField, getById,
    fetchAll, create, update, remove,
  }
})
