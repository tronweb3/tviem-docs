---
title: tviem · TypeScript Interface for TRON
titleTemplate: false
layout: page
pageClass: landing
outline: false
---

<div class="max-w-[1120px] mx-auto vp-doc relative px-[24px] mb-[96px] mt-[32px] md:px-0 md:mb-[64px]">
<div class="pt-[48px] max-sm:pt-0">
<div class="max-sm:px-0 flex justify-between z-0 max-md:justify-center">
<div class="space-y-8 max-w-[400px] flex flex-col items-start max-md:items-center">
  <img class="h-[64px] max-sm:h-[54px] dark:hidden" src="/logo-light.svg" alt="tviem logo" />
  <img class="h-[64px] max-sm:h-[54px] hidden dark:block" src="/logo-dark.svg" alt="tviem logo" />
  <div class="font-regular text-[21px] max-sm:text-[18px] text-[#919193] max-md:text-center">Build reliable apps &amp; libraries with <span class="text-black dark:text-white">lightweight</span>, <span class="text-black dark:text-white">composable</span>, and <span class="text-black dark:text-white">type-safe</span> modules that interface with TRON</div>
  <div class="flex justify-center space-x-2 flex-nowrap">
    <a class="landing-btn landing-btn--accent" href="/docs/getting-started">Get started</a>
    <a class="landing-btn" href="/docs/introduction">Why tviem?</a>
    <a class="landing-btn" href="https://github.com/tronweb3/tviem">GitHub</a>
  </div>
</div>
<div class="flex flex-col justify-between w-[440px] space-y-10 max-lg:w-[300px] max-md:hidden">
<div id="home-install" class="h-full">

  :::code-group

  ```bash [npm]
  npm i @tronweb3/tviem
  ```

  ```bash [pnpm]
  pnpm i @tronweb3/tviem
  ```

  ```bash [bun]
  bun i @tronweb3/tviem
  ```

  :::

</div>
<div class="flex justify-between space-x-2">
  <div class="flex-1 h-[44px] p-1.5 flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5">
    <span class="font-medium text-[15px] opacity-60 bg-black/10 dark:bg-black/40 px-3 h-full flex items-center rounded-md">chains</span>
    <span class="font-medium text-[15px] text-black dark:text-white flex-1 text-center">3</span>
  </div>
  <div class="flex-1 h-[44px] p-1.5 flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5">
    <span class="font-medium text-[15px] opacity-60 bg-black/10 dark:bg-black/40 px-3 h-full flex items-center rounded-md">actions</span>
    <span class="font-medium text-[15px] text-black dark:text-white flex-1 text-center">54</span>
  </div>
  <div class="flex-1 h-[44px] p-1.5 flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 max-lg:hidden">
    <span class="font-medium text-[15px] opacity-60 bg-black/10 dark:bg-black/40 px-3 h-full flex items-center rounded-md">license</span>
    <span class="font-medium text-[15px] text-black dark:text-white flex-1 text-center">MIT</span>
  </div>
</div>
</div>
</div>
<!-- Grid rather than fixed-height cards: rows stretch to the tallest card,
     so a longer blurb or a "See more" link cannot spill past the border. -->
<div class="grid grid-cols-4 gap-4 mt-16 max-lg:grid-cols-2 max-sm:grid-cols-1">
  <div class="relative overflow-hidden rounded-lg border border-solid border-black/10 dark:border-white/10">
    <div class="absolute inset-0 z-0 opacity-20 dark:bg-[#313136]"></div>
    <div class="relative z-10 flex h-full min-h-[168px] flex-col px-5 py-6 max-lg:min-h-[142px]">
      <div class="text-xl font-medium text-black dark:text-white">Modular</div>
      <div class="mt-3 text-[17px] leading-snug text-[#919193]">Tree-shakeable actions you compose into exactly the client you need</div>
    </div>
  </div>
  <div class="relative overflow-hidden rounded-lg border border-solid border-black/10 dark:border-white/10">
    <div class="absolute inset-0 z-0 opacity-20 dark:bg-[#313136]"></div>
    <div class="relative z-10 flex h-full min-h-[168px] flex-col px-5 py-6 max-lg:min-h-[142px]">
      <div class="text-xl font-medium text-black dark:text-white">Typed APIs</div>
      <div class="mt-3 text-[17px] leading-snug text-[#919193]">Contract calls inferred from the ABI — arguments and return values</div>
      <a href="/docs/guides/typescript" class="mt-auto pt-3 text-[17px]">See more</a>
    </div>
  </div>
  <div class="relative overflow-hidden rounded-lg border border-solid border-black/10 dark:border-white/10">
    <div class="absolute inset-0 z-0 opacity-20 dark:bg-[#313136]"></div>
    <div class="relative z-10 flex h-full min-h-[168px] flex-col px-5 py-6 max-lg:min-h-[142px]">
      <div class="text-xl font-medium text-black dark:text-white">Build or Send</div>
      <div class="mt-3 text-[17px] leading-snug text-[#919193]">Every write action has a build* twin that stops before broadcast</div>
      <a href="/docs/guides/build-vs-send" class="mt-auto pt-3 text-[17px]">See more</a>
    </div>
  </div>
  <div class="relative overflow-hidden rounded-lg border border-solid border-black/10 dark:border-white/10">
    <div class="absolute inset-0 z-0 opacity-20 dark:bg-[#313136]"></div>
    <div class="relative z-10 flex h-full min-h-[168px] flex-col px-5 py-6 max-lg:min-h-[142px]">
      <div class="text-xl font-medium text-black dark:text-white">TRON-native</div>
      <div class="mt-3 text-[17px] leading-snug text-[#919193]">Base58 addresses, energy &amp; bandwidth, TRC-10, multi-signature permissions</div>
    </div>
  </div>
</div>
</div>
</div>

<article class="vp-doc landing-article max-w-[70ch] mx-auto space-y-4 px-[24px] md:px-0">

## Overview

```ts twoslash
// 1. Import modules.
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

// 2. Set up your client with desired chain & transport.
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// 3. Consume an action!
const balance = await client.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## Features

tviem supports all these features out-of-the-box:

- Abstractions over the TRON HTTP API so you stop hand-rolling `fetch` calls
- First-class APIs for TRC-20 and any TVM [smart contract](/docs/contract/getContract)
- Read and write split across a [Public Client](/docs/clients/public) and a [Wallet Client](/docs/clients/wallet)
- Every write action has a [`build*` twin](/docs/guides/build-vs-send) that returns an unsigned transaction
- Native [`bigint`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) for SUN amounts, instead of a BigNumber library
- Utilities for TRON's [three address forms](/docs/guides/addresses) — Base58Check, `41`-hex, EVM hex
- [Energy, bandwidth and staking](/docs/guides/resources) modelled as first-class actions
- TypeScript ready — [inferred types](/docs/guides/typescript) from ABIs and TIP-712 typed data
- Multi-signature permissions, TRC-10 assets, proposals and exchanges in the [action catalog](/docs/actions/wallet/catalog)

## Community

- Follow development in the [tviem repository](https://github.com/tronweb3/tviem)
- Report a bug or request a feature in [GitHub Issues](https://github.com/tronweb3/tviem/issues)

</article>
