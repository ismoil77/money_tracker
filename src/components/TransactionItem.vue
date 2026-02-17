<template>
  <div class="tx" @click="$emit('edit', tx)">
    <div class="tx-left">
      <div :class="['tx-badge', tx.type]">
        {{ tx.type === 'income' ? '↑' : '↓' }}
      </div>
      <div class="tx-info">
        <div class="tx-cat">{{ tx.category }}</div>
        <div class="tx-meta">
          {{ formattedDate }}
          <span v-if="tx.subcategory"> · {{ tx.subcategory }}</span>
          <span v-if="tx.source"> · {{ tx.source }}</span>
        </div>
      </div>
    </div>
    <div class="tx-right">
      <div :class="['tx-amount', tx.type]">
        {{ tx.type === 'income' ? '+' : '-' }}{{ formatted }}
      </div>
      <div v-if="converted" class="tx-converted">{{ converted }}</div>
    </div>
    <button class="tx-delete" @click.stop="$emit('delete', tx.id)" aria-label="Удалить">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatMoney } from '@/utils/formatters.js'
import { useSettingsStore } from '@/stores/settingsStore.js'

const props = defineProps({
  tx: { type: Object, required: true }
})
defineEmits(['edit', 'delete'])

const settings = useSettingsStore()

const formattedDate = computed(() => formatDate(props.tx.date))
const formatted = computed(() => formatMoney(props.tx.amount, 'SM'))
const converted = computed(() => {
  if (settings.currency === 'TJS') return ''
  const val = settings.convert(props.tx.amount)
  return `≈ ${formatMoney(val, settings.symbol)}`
})
</script>

<style scoped>
.tx {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}
.tx:hover {
  border-color: var(--border-hover);
  background: var(--surface-hover);
}
.tx:active { background: var(--surface-active) }

.tx-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.tx-badge {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}
.tx-badge.income {
  background: var(--green-soft);
  color: var(--green);
  border: 1px solid var(--green-border);
}
.tx-badge.expense {
  background: var(--red-soft);
  color: var(--red);
  border: 1px solid var(--red-border);
}

.tx-info { min-width: 0 }
.tx-cat {
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tx-meta {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-right { text-align: right; flex-shrink: 0 }
.tx-amount {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.9rem;
}
.tx-amount.income { color: var(--green) }
.tx-amount.expense { color: var(--red) }
.tx-converted {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.tx-delete {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}
.tx:hover .tx-delete { opacity: 1 }
.tx-delete:hover { background: var(--red-soft); color: var(--red) }

/* On mobile, always show delete */
@media (max-width: 480px) {
  .tx-delete { opacity: 0.5 }
}
</style>
