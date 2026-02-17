<template>
  <div class="sources-grid">
    <div v-for="s in sources" :key="s.key" class="source-item">
      <div :class="['source-dot', s.key]"></div>
      <div class="source-body">
        <div class="source-header">
          <span class="source-name">{{ s.icon }} {{ s.label }}</span>
          <span class="source-pct">{{ s.pct }}%</span>
        </div>
        <div class="source-bar-track">
          <div :class="['source-bar-fill', s.key]" :style="{ width: s.pct + '%' }"></div>
        </div>
        <div class="source-amount">{{ s.formatted }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sources: { type: Array, required: true }
  // Each: { key, label, icon, pct, formatted }
})
</script>

<style scoped>
.sources-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.source-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: var(--transition);
}
.source-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}
.source-dot.salary   { background: var(--green) }
.source-dot.parents  { background: var(--purple) }
.source-dot.freelance { background: var(--orange) }

.source-body { flex: 1; min-width: 0 }
.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.source-name { font-size: 0.82rem; font-weight: 600 }
.source-pct {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}
.source-bar-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}
.source-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}
.source-bar-fill.salary   { background: var(--green) }
.source-bar-fill.parents  { background: var(--purple) }
.source-bar-fill.freelance { background: var(--orange) }

.source-amount {
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--green);
}
</style>
