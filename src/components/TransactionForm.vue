<template>
  <div class="tx-form fade-in">
    <!-- Type toggle -->
    <div class="type-toggle">
      <button
        v-for="t in TRANSACTION_TYPES"
        :key="t.value"
        :class="['type-btn', t.value, { active: form.type === t.value }]"
        @click="setType(t.value)"
      >
        {{ t.icon }} {{ t.label }}
      </button>
    </div>

    <!-- Amount (big prominent input) -->
    <div class="amount-section">
      <label class="form-label">Сумма (сомони)</label>
      <input
        ref="amountInput"
        class="amount-input"
        type="number"
        v-model.number="form.amount"
        step="0.01"
        min="0"
        placeholder="0.00"
        inputmode="decimal"
      >
      <div v-if="form.amount > 0 && settings.currency !== 'TJS'" class="amount-converted">
        ≈ {{ convertedDisplay }}
      </div>
    </div>

    <!-- Fields grid -->
    <div class="fields">
      <div class="field">
        <label class="form-label">Дата</label>
        <input class="form-control" type="date" v-model="form.date">
      </div>

      <div class="field">
        <label class="form-label">Категория</label>
        <select class="form-control" v-model="form.category" @change="form.subcategory = ''">
          <option v-for="c in categoryList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <label class="form-label">Подкатегория</label>
        <select class="form-control" v-model="form.subcategory">
          <option value="">— нет —</option>
          <option v-for="s in subcategoryList" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div v-if="form.type === 'income'" class="field">
        <label class="form-label">Источник дохода</label>
        <select class="form-control" v-model="form.source">
          <option value="Зарплата">💼 Зарплата</option>
          <option value="Родители">👨‍👩‍👧 Помощь родителей</option>
          <option value="Подработка">💻 Подработка</option>
        </select>
      </div>

      <div class="field full">
        <label class="form-label">Комментарий</label>
        <textarea
          class="form-control"
          v-model="form.comment"
          placeholder="Необязательно..."
          rows="2"
        ></textarea>
      </div>
    </div>

    <!-- Actions -->
    <button
      class="btn btn-primary btn-block btn-lg"
      @click="submit"
      :disabled="saving || !form.amount || form.amount <= 0"
    >
      {{ saving ? '⏳ Сохранение...' : (isEdit ? '💾 Обновить' : '✓ Добавить') }}
    </button>

    <button v-if="isEdit" class="btn btn-ghost btn-block" @click="$emit('cancel')" style="margin-top:8px">
      Отмена
    </button>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.js'
import { formatMoney } from '@/utils/formatters.js'
import { todayISO } from '@/utils/formatters.js'
import {
  EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES
} from '@/utils/constants.js'

const props = defineProps({
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])

const settings = useSettingsStore()
const amountInput = ref(null)

const isEdit = computed(() => !!props.initial?.id)

const form = reactive({
  type: 'expense',
  date: todayISO(),
  category: 'Еда',
  subcategory: '',
  amount: 0,
  source: 'Зарплата',
  comment: '',
})

// Populate from initial if editing
onMounted(() => {
  if (props.initial) {
    Object.assign(form, {
      type: props.initial.type || 'expense',
      date: props.initial.date || todayISO(),
      category: props.initial.category || 'Еда',
      subcategory: props.initial.subcategory || '',
      amount: props.initial.amount || 0,
      source: props.initial.source || 'Зарплата',
      comment: props.initial.comment || '',
    })
  }
  // Focus amount on mobile
  setTimeout(() => amountInput.value?.focus(), 300)
})

const categoryMap = computed(() =>
  form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
)
const categoryList = computed(() => Object.keys(categoryMap.value))
const subcategoryList = computed(() => categoryMap.value[form.category] || [])

const convertedDisplay = computed(() => {
  const val = settings.convert(form.amount || 0)
  return formatMoney(val, settings.symbol)
})

function setType(type) {
  form.type = type
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  form.category = Object.keys(cats)[0]
  form.subcategory = ''
  if (type === 'income') form.source = 'Зарплата'
}

function submit() {
  if (!form.amount || form.amount <= 0) return
  emit('submit', { ...form })
}
</script>

<style scoped>
.tx-form {
  padding-top: 8px;
}

/* ── Type Toggle ── */
.type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}
.type-btn {
  padding: 12px;
  border-radius: var(--radius);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.9rem;
  transition: var(--transition);
}
.type-btn:hover { border-color: var(--border-hover) }
.type-btn.income.active {
  background: var(--green-soft);
  border-color: var(--green-border);
  color: var(--green);
}
.type-btn.expense.active {
  background: var(--red-soft);
  border-color: var(--red-border);
  color: var(--red);
}

/* ── Amount Section ── */
.amount-section {
  margin-bottom: 20px;
}
.amount-input {
  width: 100%;
  background: var(--input-bg);
  border: 2px solid var(--border);
  color: var(--text);
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  font-family: var(--mono);
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
  outline: none;
  transition: var(--transition);
  -webkit-appearance: none;
}
.amount-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-glow);
}
.amount-input::placeholder { color: var(--text-muted); font-weight: 400 }
.amount-converted {
  text-align: center;
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 6px;
}

/* ── Fields ── */
.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}
.field.full { grid-column: 1 / -1 }

@media (max-width: 480px) {
  .fields { grid-template-columns: 1fr }
  .amount-input { font-size: 1.5rem; padding: 16px }
}
</style>
