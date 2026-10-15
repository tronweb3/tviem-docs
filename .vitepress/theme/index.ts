import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import type { EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import '@shikijs/vitepress-twoslash/style.css'
import './custom.css'

import WalletAdapterFooter from './components/WalletAdapterFooter.vue'

export default {
  extends: DefaultTheme,
  // `layout-bottom` renders below VitePress's own footer on every page,
  // including the sidebar pages where that footer is hidden.
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(WalletAdapterFooter),
    }),
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
