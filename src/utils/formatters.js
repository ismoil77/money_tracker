/**
 * Pure formatting utilities.
 * All functions are stateless and testable.
 */

/**
 * Format number as money string with spaces as thousands separator.
 * Precision: 0.01
 */
export function formatMoney(amount, symbol = 'SM') {
  const fixed = Number(amount || 0).toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formatted}.${decPart} ${symbol}`
}

/**
 * Convert amount between currencies.
 * baseRate = how many units of target currency per 1 unit of base currency.
 */
export function convertCurrency(amount, rate) {
  if (!rate || rate === 0) return 0
  return Math.round((amount * rate) * 100) / 100
}

/**
 * Format date to readable Russian short format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

/**
 * Format date for display in headers (month + year).
 */
export function formatMonthYear(date) {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Safe percentage calculation.
 */
export function calcPercent(part, total) {
  if (!total || total === 0) return 0
  return Math.round((part / total) * 100)
}

/**
 * Get today's date in YYYY-MM-DD format.
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
