<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: $route.path === item.to }"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>

    <!-- Quick Add FAB -->
    <router-link to="/add" class="fab" :class="{ active: $route.path === '/add' }">
      <span class="fab-icon">+</span>
    </router-link>
  </nav>
</template>

<script setup>
const navItems = [
  { to: '/',             icon: '📊', label: 'Обзор' },
  { to: '/transactions', icon: '📋', label: 'История' },
  { to: '/settings',     icon: '⚙️', label: 'Настройки' },
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--nav-bg);
  backdrop-filter: var(--nav-blur);
  -webkit-backdrop-filter: var(--nav-blur);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px 12px calc(6px + env(safe-area-inset-bottom, 0px));
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 600;
  transition: var(--transition);
  letter-spacing: 0.3px;
}
.nav-item:hover,
.nav-item.active {
  color: var(--accent);
}
.nav-icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* ── Floating Action Button ── */
.fab {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px var(--accent-glow), 0 2px 8px rgba(0,0,0,0.3);
  transition: var(--transition);
  text-decoration: none;
}
.fab:hover {
  transform: translateX(-50%) scale(1.08);
  box-shadow: 0 6px 28px var(--accent-glow);
}
.fab.active {
  background: var(--green);
  box-shadow: 0 4px 20px rgba(16,185,129,0.3);
}
.fab-icon {
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -1px;
}
</style>
