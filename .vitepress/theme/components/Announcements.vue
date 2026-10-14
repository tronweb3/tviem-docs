<script setup lang="ts">
import { withBase } from 'vitepress'

const announcements = [
  {
    badge: 'Latest release',
    version: 'v1.0.0-beta.1',
    summary:
      'The first public beta, with type-safe TRON clients, public and wallet actions, trustless local signing, and tree-shakable packaging.',
    path: '/announcements/v1.0.0-beta.1',
  },
]
</script>

<template>
  <main class="announcements-page">
    <div class="announcements-container">
      <header class="announcements-header">
        <h1>Announcements</h1>
        <p>Release notes and project updates from tviem.</p>
      </header>

      <section class="announcement-grid" aria-label="tviem releases">
        <a
          v-for="announcement in announcements"
          :key="announcement.version"
          class="announcement-card"
          :href="withBase(announcement.path)"
        >
          <span class="announcement-card-kicker">{{ announcement.badge }}</span>
          <h2>{{ announcement.version }}</h2>
          <p>{{ announcement.summary }}</p>
          <span class="announcement-card-cta">View release notes →</span>
        </a>
      </section>
    </div>
  </main>
</template>

<style scoped>
.announcements-page {
  min-height: calc(100vh - var(--vp-nav-height));
  padding: 64px 24px 96px;
}

.announcements-container {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

.announcements-header h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 40px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.announcements-header p {
  max-width: 640px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1.65;
}

.announcement-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.announcement-card {
  display: flex;
  flex-direction: column;
  min-height: 230px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.announcement-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.announcement-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.announcement-card-kicker {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.announcement-card h2 {
  margin: 14px 0 10px;
  border: 0;
  font-size: 24px;
  line-height: 1.25;
}

.announcement-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.announcement-card-cta {
  margin-top: auto;
  padding-top: 24px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .announcements-page {
    padding: 40px 24px 72px;
  }

  .announcements-header h1 {
    font-size: 32px;
  }
}
</style>
