import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '@/services/api.js'
import { CURRENCIES, DEFAULT_CURRENCY } from '@/utils/constants.js'

export const useSettingsStore = defineStore('settings', () => {
  // ═══ STATE ═══
  const currency = ref(DEFAULT_CURRENCY)
  const customRates = ref({}) // user-overridden rates
  const theme = ref('dark')
  const loaded = ref(false)

  // ═══ GETTERS ═══
  const currencyObj = computed(() =>
    CURRENCIES.find(c => c.code === currency.value) || CURRENCIES[0]
  )

  const symbol = computed(() => currencyObj.value.symbol)

  /**
   * Get conversion rate FROM base (TJS) TO display currency.
   * Rate = 1 means display in TJS.
   */
  const displayRate = computed(() => {
    if (customRates.value[currency.value] !== undefined) {
      return customRates.value[currency.value]
    }
    return currencyObj.value.rate
  })

  /**
   * Convert base amount (TJS) to display currency.
   */
  function convert(amountInBase) {
    return Math.round((amountInBase * displayRate.value) * 100) / 100
  }

  // ═══ THEME ═══
  function setTheme(t) {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('cf-theme', t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
    persistToServer()
  }

  // ═══ PERSISTENCE ═══
  async function loadFromServer() {
    try {
      const data = await api.getSettings()
      if (data) {
        if (data.currency) currency.value = data.currency
        if (data.customRates) customRates.value = data.customRates
        if (data.theme) setTheme(data.theme)
      }
    } catch {
      // Fallback: use defaults
    }
    // Also check localStorage for theme (faster)
    const savedTheme = localStorage.getItem('cf-theme')
    if (savedTheme) setTheme(savedTheme)
    loaded.value = true
  }

  async function persistToServer() {
    try {
      await api.saveSettings({
        currency: currency.value,
        customRates: customRates.value,
        theme: theme.value,
      })
    } catch {
      // Silent fail — settings are non-critical
    }
  }

  function setCurrency(code) {
    currency.value = code
    persistToServer()
  }

  function setCustomRate(code, rate) {
    customRates.value = { ...customRates.value, [code]: Number(rate) }
    persistToServer()
  }

  return {
    currency, customRates, theme, loaded,
    currencyObj, symbol, displayRate,
    convert, setTheme, toggleTheme,
    loadFromServer, persistToServer,
    setCurrency, setCustomRate,
  }
})
