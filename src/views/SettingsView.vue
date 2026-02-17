<template>
  <div class="settings-view fade-in">
    <h1 class="page-title">⚙️ Настройки</h1>

    <!-- Theme Toggle -->
    <div class="setting-card">
      <div class="setting-header">
        <div>
          <div class="setting-title">Тема оформления</div>
          <div class="setting-desc">Переключение между тёмной и светлой</div>
        </div>
        <button class="theme-toggle" @click="settings.toggleTheme()">
          <div class="toggle-track" :class="{ light: settings.theme === 'light' }">
            <div class="toggle-thumb">
              {{ settings.theme === 'dark' ? '🌙' : '☀️' }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Currency -->
    <div class="setting-card">
      <div class="setting-title">Валюта отображения</div>
      <div class="setting-desc">Базовая валюта — Сомони (TJS). Суммы конвертируются по курсу.</div>
      <div class="currency-grid">
        <button
          v-for="c in CURRENCIES"
          :key="c.code"
          :class="['currency-btn', { active: settings.currency === c.code }]"
          @click="settings.setCurrency(c.code)"
        >
          <span class="cur-symbol">{{ c.symbol }}</span>
          <span class="cur-code">{{ c.code }}</span>
          <span class="cur-name">{{ c.name }}</span>
        </button>
      </div>
    </div>

    <!-- Custom Rate -->
    <div class="setting-card" v-if="settings.currency !== 'TJS'">
      <div class="setting-title">
        Курс: 1 SM → {{ settings.displayRate }} {{ settings.symbol }}
      </div>
      <div class="setting-desc">Укажите свой курс конвертации</div>
      <input
        class="form-control"
        type="number"
        :value="settings.displayRate"
        @change="settings.setCustomRate(settings.currency, $event.target.value)"
        step="0.01"
        min="0.001"
        style="max-width: 200px; margin-top: 10px"
      >
    </div>

    <!-- App Info -->
    <div class="setting-card info-card">
      <div class="setting-title">CashFlow</div>
      <div class="setting-desc">
        Система учёта личных финансов.<br>
        Данные хранятся на сервере и доступны с любого устройства.<br>
        API: mokky.dev · Vue 3 + Pinia + Vue Router
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settingsStore.js'
import { CURRENCIES } from '@/utils/constants.js'

const settings = useSettingsStore()
</script>

<style scoped>
.settings-view { padding-top: 16px }

.setting-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 12px;
  transition: var(--transition);
}
.setting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.setting-title {
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.setting-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* ── Theme Toggle ── */
.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  flex-shrink: 0;
}
.toggle-track {
  width: 56px;
  height: 30px;
  border-radius: 15px;
  background: var(--accent);
  position: relative;
  transition: var(--transition);
  cursor: pointer;
}
.toggle-track.light { background: var(--orange) }
.toggle-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle-track.light .toggle-thumb {
  left: 29px;
}

/* ── Currency Grid ── */
.currency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
  margin-top: 12px;
}
.currency-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 10px;
  border-radius: var(--radius);
  border: 1.5px solid var(--border);
  background: var(--input-bg);
  color: var(--text-secondary);
  transition: var(--transition);
}
.currency-btn:hover { border-color: var(--border-hover) }
.currency-btn.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.cur-symbol { font-size: 1.1rem; font-weight: 800 }
.cur-code { font-family: var(--mono); font-size: 0.75rem; font-weight: 700 }
.cur-name { font-size: 0.65rem; color: var(--text-muted) }
.currency-btn.active .cur-name { color: var(--accent) }

.info-card {
  opacity: 0.6;
  margin-top: 24px;
}
</style>
