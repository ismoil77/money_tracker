<template>
  <div class="transactions-view fade-in">
    <h1 class="page-title">📋 История</h1>

    <MonthNav :label="monthNav.label.value" @prev="monthNav.prev" @next="monthNav.next" />

    <!-- Loading -->
    <div v-if="txStore.loading" class="loader">
      <div class="spinner"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">Нет транзакций за этот период</div>
      <router-link to="/add" class="btn btn-primary" style="margin-top:12px">
        + Добавить первую
      </router-link>
    </div>

    <!-- List -->
    <div v-else class="tx-list">
      <TransactionItem
        v-for="tx in filtered"
        :key="tx.id"
        :tx="tx"
        @edit="goEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Month summary -->
    <div v-if="filtered.length > 0" class="month-summary">
      <div class="summary-row">
        <span>Доходы:</span>
        <span class="income">+{{ fmtMoney(incomeTotal) }}</span>
      </div>
      <div class="summary-row">
        <span>Расходы:</span>
        <span class="expense">-{{ fmtMoney(expenseTotal) }}</span>
      </div>
      <div class="summary-row total">
        <span>Итого:</span>
        <span :class="incomeTotal - expenseTotal >= 0 ? 'income' : 'expense'">
          {{ fmtMoney(incomeTotal - expenseTotal) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { useMonthNav } from '@/composables/useMonthNav.js'
import { useToast } from '@/composables/useToast.js'
import { formatMoney } from '@/utils/formatters.js'

import MonthNav from '@/components/MonthNav.vue'
import TransactionItem from '@/components/TransactionItem.vue'

const txStore = useTransactionStore()
const monthNav = useMonthNav()
const router = useRouter()
const toast = useToast()

const filtered = computed(() => {
  return txStore.byMonth(monthNav.currentMonth.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const incomeTotal = computed(() =>
  txStore.sumByField(filtered.value.filter(t => t.type === 'income'))
)
const expenseTotal = computed(() =>
  txStore.sumByField(filtered.value.filter(t => t.type === 'expense'))
)

function fmtMoney(n) { return formatMoney(n, 'SM') }

function goEdit(tx) {
  router.push(`/edit/${tx.id}`)
}

async function handleDelete(id) {
  if (!confirm('Удалить транзакцию?')) return
  try {
    await txStore.remove(id)
    toast.success('Удалено ✓')
  } catch {
    toast.error('Ошибка удаления')
  }
}
</script>

<style scoped>
.transactions-view { padding-top: 16px }

.tx-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}
.spinner {
  width: 30px; height: 30px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-muted);
}
.empty-icon { font-size: 2.5rem; margin-bottom: 10px; opacity: 0.4 }
.empty-text { font-size: 0.9rem }

.month-summary {
  margin-top: 16px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.summary-row.total {
  border-top: 1px solid var(--border);
  margin-top: 6px;
  padding-top: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text);
}
.income { color: var(--green); font-family: var(--mono); font-weight: 700 }
.expense { color: var(--red); font-family: var(--mono); font-weight: 700 }
</style>
