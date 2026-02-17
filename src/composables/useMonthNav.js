import { ref, computed } from 'vue'
import { formatMonthYear } from '@/utils/formatters.js'

export function useMonthNav() {
  const currentMonth = ref(new Date())

  const label = computed(() => formatMonthYear(currentMonth.value))

  function prev() {
    const d = new Date(currentMonth.value)
    d.setMonth(d.getMonth() - 1)
    currentMonth.value = d
  }

  function next() {
    const d = new Date(currentMonth.value)
    d.setMonth(d.getMonth() + 1)
    currentMonth.value = d
  }

  return { currentMonth, label, prev, next }
}
