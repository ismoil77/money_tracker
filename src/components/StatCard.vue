<template>
  <div :class="['stat-card', variant]">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="sub" class="stat-sub">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  sub: String,
  variant: { type: String, default: 'default' } // income | expense | balance | plan
})
</script>

<style scoped>
.stat-card {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.stat-card.income::before  { background: linear-gradient(90deg, var(--green), #34d399) }
.stat-card.expense::before { background: linear-gradient(90deg, var(--red), #f87171) }
.stat-card.balance::before { background: linear-gradient(90deg, var(--accent), var(--purple)) }
.stat-card.plan::before    { background: linear-gradient(90deg, var(--orange), #fbbf24) }

.stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 6px;
}
.stat-value {
  font-size: 1.35rem;
  font-weight: 800;
  font-family: var(--mono);
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.stat-card.income .stat-value  { color: var(--green) }
.stat-card.expense .stat-value { color: var(--red) }
.stat-card.balance .stat-value { color: var(--accent) }
.stat-card.plan .stat-value    { color: var(--orange) }

.stat-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
  font-family: var(--mono);
}
</style>
