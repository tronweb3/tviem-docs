---
description: Define a custom TRON chain.
title: defineChain
---

# defineChain

Defines a Chain for a network tviem does not ship — a private chain, a local
node, or a testnet of your own.

## Import

```ts twoslash
import { defineChain } from '@tronweb3/tviem/chains'
```

## Usage

```ts twoslash
import { defineChain } from '@tronweb3/tviem/chains'

export const localnet = defineChain({
  id: 1,
  name: 'Local TRON',
  nativeCurrency: { name: 'TRON', symbol: 'TRX', decimals: 6 },
  rpcUrls: {
    default: {
      full: { http: ['http://127.0.0.1:8090'] },
      solidity: { http: ['http://127.0.0.1:8091'] },
      event: { http: ['http://127.0.0.1:8092'] },
    },
  },
  blockTime: 3000,
})
```

Then pass it to a Client like any built-in chain:

```ts twoslash
// @filename: localnet.ts
import { defineChain } from '@tronweb3/tviem/chains'
export const localnet = defineChain({
  id: 1,
  name: 'Local TRON',
  nativeCurrency: { name: 'TRON', symbol: 'TRX', decimals: 6 },
  rpcUrls: {
    default: {
      full: { http: ['http://127.0.0.1:8090'] },
      solidity: { http: ['http://127.0.0.1:8091'] },
      event: { http: ['http://127.0.0.1:8092'] },
    },
  },
  blockTime: 3000,
})
// @filename: index.ts
// ---cut---
import { createPublicClient, http } from '@tronweb3/tviem'
import { localnet } from './localnet.js'

const client = createPublicClient({
  chain: localnet,
  transport: http(),
})
```

`defineChain` preserves the literal types of what you pass, so `client.chain.id`
narrows to `1` rather than widening to `number`.

## Parameters

### id

- **Type:** `number`

The chain id, as reported by the TVM's `chainid()`.

### name

- **Type:** `string`

A human-readable name.

### nativeCurrency

- **Type:** `{ name: string; symbol: string; decimals: number }`

The chain's native currency. For a TRON-compatible chain this is TRX with
`decimals: 6`.

### rpcUrls

- **Type:** `{ default: { full: { http: string[] }; solidity: { http: string[] }; event: { http: string[] } } }`

Endpoint groups for the FullNode, SolidityNode and event service. If your node
serves all three from one host, repeat the same URL — that is what the built-in
`mainnet` does.

### blockTime (optional)

- **Type:** `number`

Expected time between blocks, in milliseconds. Used as the default polling
interval for waiting actions.

## Extending a chain

Chains returned by `defineChain` carry an `extend` method for layering extra
fields on top without redefining the whole object:

```ts twoslash
import { mainnet } from '@tronweb3/tviem/chains'

export const mainnetWithExplorer = mainnet.extend({
  blockExplorers: {
    default: { name: 'Tronscan', url: 'https://tronscan.org' },
  },
})
```
