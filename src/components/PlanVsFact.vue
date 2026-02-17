<template>
  <div class="pvf-wrap">
    <div v-for="row in rows" :key="row.category" class="pvf-row">
      <div class="pvf-info">
        <div class="pvf-cat">{{ row.category }}</div>
        <div class="pvf-numbers">
          <span class="pvf-fact" :class="{ over: row.pct > 100 }">
            {{ row.factFormatted }}
          </span>
          <span class="pvf-sep">/</span>
          <input
            class="pvf-plan-input"
            type="number"
            :value="row.plan"
            @change="$emit('updatePlan', row.category, $event.target.value)"
            step="50"
            min="0"
            :placeholder="'План'"
          >
        </div>
      </div>
      <div class="pvf-visual">
        <div class="pvf-bar-track">
          <div
            class="pvf-bar-fill"
            :class="{ over: row.pct > 100, warn: row.pct > 80 && row.pct <= 100 }"
            :style="{ width: Math.min(row.pct, 100) + '%' }"
          ></div>
        </div>
        <span class="pvf-pct" :class="{ over: row.pct > 100 }">{{ row.pct }}%</span>
      </div>
      <!-- Mini sparkline -->
      <div class="pvf-spark">
        <div
          v-for="(v, i) in row.spark"
          :key="i"
          class="spark-bar"
          :style="{
            height: v + '%',
            background: v > 70 ? 'var(--red)' : v > 40 ? 'var(--orange)' : 'var(--accent)'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Array, required: true }
  // Each: { category, plan, fact, factFormatted, diff, pct, spark[] }
})
defineEmits(['updatePlan'])
</script>

<style scoped>
.pvf-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pvf-row {
  display: grid;
  grid-template-columns: 1fr 1fr 50px;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: var(--transition);
}
.pvf-row:hover { border-color: var(--border-hover) }

.pvf-cat {
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.pvf-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--mono);
  font-size: 0.75rem;
}
.pvf-fact { font-weight: 700; color: var(--text) }
.pvf-fact.over { color: var(--red) }
.pvf-sep { color: var(--text-muted) }
.pvf-plan-input {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  width: 70px;
  padding: 2px 6px;
  border-radius: 4px;
  text-align: right;
  outline: none;
  transition: var(--transition);
}
.pvf-plan-input:hover { border-color: var(--border) }
.pvf-plan-input:focus {
  border-color: var(--accent);
  background: var(--input-bg);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.pvf-visual {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pvf-bar-track {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}
.pvf-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--accent);
  transition: width 0.5s ease;
}
.pvf-bar-fill.warn { background: var(--orange) }
.pvf-bar-fill.over { background: var(--red) }

.pvf-pct {
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 34px;
  text-align: right;
}
.pvf-pct.over { color: var(--red) }

.pvf-spark {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 22px;
}
.spark-bar {
  width: 5px;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.3s ease;
}

@media (max-width: 480px) {
  .pvf-row {
    grid-template-columns: 1fr 80px;
    gap: 8px;
  }
  .pvf-spark { display: none }
}
</style>
