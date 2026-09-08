import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'tviem',
  titleTemplate: ':title · tviem',
  description:
    'Build reliable TRON apps & libraries with lightweight, composable, and type-safe modules from tviem.',
  srcDir: 'pages',
  // Keep the extensionless /docs/* URLs the site has always had. Needs
  // rewrite support from the host (automatic on GitHub Pages / Netlify).
  cleanUrls: true,
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicons/light.svg',
        media: '(prefers-color-scheme: light)',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicons/dark.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  ],
  ...(process.env.SITE_URL
    ? { sitemap: { hostname: process.env.SITE_URL } }
    : {}),
  markdown: {
    codeTransformers: [
      {
        // Whole-file `<!--@include:-->`s carry the snippet's `// #region`
        // marker lines along; drop them before highlighting (and before
        // twoslash sees the code).
        name: 'strip-region-markers',
        preprocess(code) {
          return code.replace(/^[ \t]*\/\/ #(?:end)?region\b.*$\n?/gm, '')
        },
      },
      transformerTwoslash({ typesCache: createFileSystemTypesCache() }),
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
    editLink: {
      pattern: 'https://github.com/web3iocore/tviem-docs/edit/main/pages/:path',
      text: 'Suggest changes to this page',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tronweb3/tviem' },
    ],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            boostDocument(documentId: string) {
              if (documentId.startsWith('/docs/actions')) return 3
              if (documentId.startsWith('/docs')) return 2
              return 1
            },
          },
        },
      },
    },
    nav: [
      { text: 'Docs', link: '/docs/getting-started', activeMatch: '/docs' },
      { text: 'Actions', link: '/docs/actions/public/introduction' },
      {
        text: 'v1.0.0-beta.1',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/tronweb3/tviem/blob/main/CHANGELOG.md',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/tronweb3/tviem/blob/main/.github/CONTRIBUTING.md',
          },
        ],
      },
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Why tviem', link: '/docs/introduction' },
            { text: 'Installation', link: '/docs/installation' },
            { text: 'Getting Started', link: '/docs/getting-started' },
            { text: 'FAQ', link: '/docs/faq' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Building a dApp', link: '/docs/guides/dapp' },
            { text: 'Building a Wallet', link: '/docs/guides/wallet' },
            { text: 'Build vs. Send', link: '/docs/guides/build-vs-send' },
            { text: 'Addresses', link: '/docs/guides/addresses' },
            { text: 'Resources & Staking', link: '/docs/guides/resources' },
            { text: 'Error Handling', link: '/docs/guides/error-handling' },
            { text: 'TypeScript', link: '/docs/guides/typescript' },
            {
              text: 'Migrating from TronWeb',
              link: '/docs/guides/tronweb-migration',
            },
          ],
        },
        {
          text: 'Clients & Transports',
          items: [
            { text: 'Introduction', link: '/docs/clients/intro' },
            { text: 'Public Client', link: '/docs/clients/public' },
            { text: 'Wallet Client', link: '/docs/clients/wallet' },
            { text: 'Build your own Client', link: '/docs/clients/custom' },
            {
              text: 'Transports',
              items: [{ text: 'HTTP', link: '/docs/clients/transports/http' }],
            },
          ],
        },
        {
          text: 'Chains',
          items: [
            { text: 'Introduction', link: '/docs/chains/intro' },
            { text: 'defineChain', link: '/docs/chains/defineChain' },
          ],
        },
        {
          text: 'Accounts',
          items: [
            { text: 'Introduction', link: '/docs/accounts/intro' },
            {
              text: 'Local Accounts',
              items: [
                {
                  text: 'privateKeyToAccount',
                  link: '/docs/accounts/privateKeyToAccount',
                },
                {
                  text: 'mnemonicToAccount',
                  link: '/docs/accounts/mnemonicToAccount',
                },
                { text: 'hdKeyToAccount', link: '/docs/accounts/hdKeyToAccount' },
                { text: 'toAccount', link: '/docs/accounts/toAccount' },
              ],
            },
            {
              text: 'Key Generation',
              items: [
                {
                  text: 'generatePrivateKey',
                  link: '/docs/accounts/generatePrivateKey',
                },
                {
                  text: 'generateMnemonic',
                  link: '/docs/accounts/generateMnemonic',
                },
              ],
            },
          ],
        },
        {
          text: 'Public Actions',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/docs/actions/public/introduction' },
            {
              text: 'Account',
              items: [
                { text: 'getBalance', link: '/docs/actions/public/getBalance' },
                { text: 'getAccount', link: '/docs/actions/public/getAccount' },
                {
                  text: 'getAccountResources',
                  link: '/docs/actions/public/getAccountResources',
                },
              ],
            },
            {
              text: 'Block',
              items: [
                { text: 'getBlock', link: '/docs/actions/public/getBlock' },
                { text: 'getNowBlock', link: '/docs/actions/public/getNowBlock' },
              ],
            },
            {
              text: 'Transaction',
              items: [
                {
                  text: 'getTransaction',
                  link: '/docs/actions/public/getTransaction',
                },
                {
                  text: 'getTransactionInfo',
                  link: '/docs/actions/public/getTransactionInfo',
                },
                {
                  text: 'waitForTransactionReceipt',
                  link: '/docs/actions/public/waitForTransactionReceipt',
                },
              ],
            },
            {
              text: 'Contract',
              items: [
                {
                  text: 'readContract',
                  link: '/docs/actions/public/readContract',
                },
                {
                  text: 'estimateEnergy',
                  link: '/docs/actions/public/estimateEnergy',
                },
                { text: 'getLogs', link: '/docs/actions/public/getLogs' },
              ],
            },
            {
              text: 'Chain',
              items: [
                {
                  text: 'getChainParameters',
                  link: '/docs/actions/public/getChainParameters',
                },
              ],
            },
          ],
        },
        {
          text: 'Wallet Actions',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/docs/actions/wallet/introduction' },
            {
              text: 'Transfer',
              items: [
                { text: 'sendTrx', link: '/docs/actions/wallet/sendTrx' },
                { text: 'sendTrc10', link: '/docs/actions/wallet/sendTrc10' },
              ],
            },
            {
              text: 'Contract',
              items: [
                {
                  text: 'writeContract',
                  link: '/docs/actions/wallet/writeContract',
                },
                {
                  text: 'deployContract',
                  link: '/docs/actions/wallet/deployContract',
                },
              ],
            },
            {
              text: 'Signing',
              items: [
                {
                  text: 'signTransaction',
                  link: '/docs/actions/wallet/signTransaction',
                },
                { text: 'signMessage', link: '/docs/actions/wallet/signMessage' },
                {
                  text: 'signTypedData',
                  link: '/docs/actions/wallet/signTypedData',
                },
                { text: 'multiSign', link: '/docs/actions/wallet/multiSign' },
              ],
            },
            {
              text: 'Broadcast',
              items: [
                {
                  text: 'broadcastTransaction',
                  link: '/docs/actions/wallet/broadcastTransaction',
                },
              ],
            },
            {
              text: 'Resources',
              items: [
                {
                  text: 'freezeBalanceV2',
                  link: '/docs/actions/wallet/freezeBalanceV2',
                },
                {
                  text: 'delegateResource',
                  link: '/docs/actions/wallet/delegateResource',
                },
              ],
            },
            { text: 'Full Catalog', link: '/docs/actions/wallet/catalog' },
          ],
        },
        {
          text: 'Contract',
          items: [{ text: 'getContract', link: '/docs/contract/getContract' }],
        },
        {
          text: 'Utilities',
          items: [
            { text: 'Addresses', link: '/docs/utilities/address' },
            { text: 'Units', link: '/docs/utilities/units' },
          ],
        },
      ],
    },
  },
})
