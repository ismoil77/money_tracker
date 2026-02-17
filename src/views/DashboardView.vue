<template>
  <div class="dashboard fade-in">
    <h1 class="page-title">📊 Обзор</h1>

    <MonthNav :label="monthNav.label.value" @prev="monthNav.prev" @next="monthNav.next" />

    <!-- Summary Cards -->
    <div class="stat-grid">
      <StatCard variant="income"  label="Доходы"  :value="fmtMoney(totalIncome)"  :sub="convertedSub(totalIncome)" />
      <StatCard variant="expense" label="Расходы" :value="fmtMoney(totalExpense)" :sub="convertedSub(totalExpense)" />
      <StatCard variant="balance" label="Баланс"  :value="fmtMoney(balance)"      :sub="'Накоплено ' + savingsRate + '%'" />
      <StatCard variant="plan"    label="Лимит"   :value="fmtMoney(totalPlan)"    :sub="'Использовано ' + planUsage + '%'" />
    </div>

    <!-- Income Sources -->
    <div class="section-label">Источники доходов</div>
    <SourceBreakdown :sources="sourcesData" />

    <!-- Plan vs Fact -->
    <div class="section-label" style="margin-top: 24px">План vs Факт по расходам</div>
    <PlanVsFact :rows="planFactRows" @updatePlan="handlePlanUpdate" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { useSettingsStore } from '@/stores/settingsStore.js'
import { usePlanStore } from '@/stores/planStore.js'
import { useMonthNav } from '@/composables/useMonthNav.js'
import { useToast } from '@/composables/useToast.js'
import { formatMoney, calcPercent } from '@/utils/formatters.js'
import {
  EXPENSE_CATEGORIES, INCOME_SOURCES, SOURCE_API_MAP
} from '@/utils/constants.js'

import MonthNav from '@/components/MonthNav.vue'
import StatCard from '@/components/StatCard.vue'
import SourceBreakdown from '@/components/SourceBreakdown.vue'
import PlanVsFact from '@/components/PlanVsFact.vue'

const txStore = useTransactionStore()
const settings = useSettingsStore()
const planStore = usePlanStore()
const monthNav = useMonthNav()
const toast = useToast()

// ═══ Computed aggregations ═══
const monthInc = computed(() => txStore.monthIncomes(monthNav.currentMonth.value))
const monthExp = computed(() => txStore.monthExpenses(monthNav.currentMonth.value))

const totalIncome  = computed(() => txStore.sumByField(monthInc.value))
const totalExpense = computed(() => txStore.sumByField(monthExp.value))
const balance      = computed(() => totalIncome.value - totalExpense.value)
const savingsRate  = computed(() => calcPercent(balance.value, totalIncome.value))

const totalPlan = computed(() => {
  return Object.keys(EXPENSE_CATEGORIES).reduce((s, cat) =>
    s + planStore.getAmount(cat), 0)
})
const planUsage = computed(() => calcPercent(totalExpense.value, totalPlan.value))

// ═══ Income Sources ═══
const sourcesData = computed(() => {
  const totals = { salary: 0, parents: 0, freelance: 0 }
  monthInc.value.forEach(t => {
    const key = SOURCE_API_MAP[t.source] || 'freelance'
    totals[key] += Number(t.amount) || 0
  })
  const total = totalIncome.value || 1
  return INCOME_SOURCES.map(s => ({
    ...s,
    amount: totals[s.key],
    pct: calcPercent(totals[s.key], total),
    formatted: fmtMoney(totals[s.key]),
  }))
})

// ═══ Plan vs Fact ═══
const planFactRows = computed(() => {
  const categories = Object.keys(EXPENSE_CATEGORIES)
  return categories.map(cat => {
    const planAmt = planStore.getAmount(cat)
    const fact = monthExp.value
      .filter(t => t.category === cat)
      .reduce((s, t) => s + (Number(t.amount) || 0), 0)
    const diff = planAmt - fact
    const pct = planAmt > 0 ? calcPercent(fact, planAmt) : (fact > 0 ? 999 : 0)
    const spark = buildSparkline(cat)
    return {
      category: cat,
      plan: planAmt,
      fact,
      factFormatted: fmtMoney(fact),
      diff,
      pct,
      spark,
    }
  })
})

function buildSparkline(category) {
  const date = monthNav.currentMonth.value
  const y = date.getFullYear()
  const m = date.getMonth()
  const allTx = txStore.items
  const bars = []
  for (let w = 0; w < 5; w++) {
    const start = new Date(y, m, w * 6 + 1)
    const end = new Date(y, m, (w + 1) * 6 + 1)
    const sum = allTx
      .filter(t => t.type === 'expense' && t.category === category)
      .filter(t => { const d = new Date(t.date); return d >= start && d < end })
      .reduce((s, t) => s + (Number(t.amount) || 0), 0)
    bars.push(sum)
  }
  const max = Math.max(...bars, 1)
  return bars.map(v => Math.round((v / max) * 100))
}

async function handlePlanUpdate(category, value) {
  try {
    await planStore.upsert(category, value)
    toast.success('План обновлён ✓')
  } catch {
    toast.error('Ошибка сохранения плана')
  }
}

// ═══ Helpers ═══
function fmtMoney(n) {
  return formatMoney(n, 'SM')
}

function convertedSub(n) {
  if (settings.currency === 'TJS') return ''
  return `≈ ${formatMoney(settings.convert(n), settings.symbol)}`
}
</script>

<style scoped>
.dashboard {
  padding-top: 16px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
@media (max-width: 380px) {
  .stat-grid { grid-template-columns: 1fr }
}
</style>
