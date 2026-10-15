<script setup lang="ts">
// The site lives under walletadapter.org/tviem/, and nothing in the default
// theme links back up to walletadapter.org. VitePress's own footer is hidden
// on every page that has a sidebar (all of /docs), so this one is rendered
// through the Layout's `layout-bottom` slot instead and appears everywhere.
import { useSidebar } from 'vitepress/theme'

// Imported rather than served from public/ so Vite applies `base` for us.
import logo from './walletadapter.png'

const { hasSidebar } = useSidebar()
</script>

<template>
  <footer class="WalletAdapterFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
      <!-- Same tab, like the navbar's "TronWallet Adapter" item (config.ts). -->
      <a class="link" href="https://walletadapter.org/">
        <img class="logo" :src="logo" alt="" width="16" height="16" />
        <span>TronWallet Adapter</span>
      </a>
      <a
        class="link"
        href="https://github.com/tronweb3/tviem"
        target="_blank"
        rel="noreferrer"
      >
        <!-- Same GitHub mark the navbar's social link uses (simple-icons). -->
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
        <span>GitHub</span>
      </a>
    </div>
  </footer>
</template>

<style scoped>
.WalletAdapterFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-divider);
  padding: 20px 24px;
  background-color: var(--vp-c-bg);
}

@media (min-width: 768px) {
  .WalletAdapterFooter {
    padding: 20px 32px;
  }
}

/* Keep clear of the fixed sidebar on desktop, mirroring VPContent. */
@media (min-width: 960px) {
  .WalletAdapterFooter.has-sidebar {
    padding-left: calc(var(--vp-sidebar-width) + 32px);
  }
}

@media (min-width: 1440px) {
  .WalletAdapterFooter.has-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 32px);
    padding-left: calc(
      (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 32px
    );
  }
}

/* Same horizontal bounds as the navbar, so the two links line up under its
   wordmark and social icon. */
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 auto;
  max-width: calc(var(--vp-layout-max-width) - 64px);
}

.has-sidebar .container {
  max-width: none;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.25s;
}

.link:hover {
  color: var(--vp-c-text-1);
}

.logo {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  opacity: 0.7;
  transition: opacity 0.25s;
}

.link:hover .logo {
  opacity: 1;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
