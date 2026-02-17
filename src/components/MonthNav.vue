<template>
  <div class="month-nav">
    <button class="month-btn" @click="$emit('prev')" aria-label="Предыдущий месяц">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <span class="month-label">{{ label }}</span>
    <button class="month-btn" @click="$emit('next')" aria-label="Следующий месяц">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
</template>

<script setup>
defineProps({ label: String })
defineEmits(['prev', 'next'])
</script>

<style scoped>
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}
.month-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.month-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.month-label {
  font-weight: 700;
  font-size: 1rem;
  min-width: 170px;
  text-align: center;
}
</style>
