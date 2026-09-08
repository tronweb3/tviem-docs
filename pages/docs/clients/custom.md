---
description: Build a client with exactly the actions you need.
title: Build your own Client
---

# Build your own Client

[`createClient`](#createclient) is the primitive that both the
[Public](/docs/clients/public) and [Wallet](/docs/clients/wallet) Clients are
built on. Use it directly when you want a smaller surface than either — or a
larger one than both.

## Import

```ts twoslash
import { createClient } from '@tronweb3/tviem'
```

## Usage

On its own, a bare Client carries the chain, transport and account, but no
actions:

```ts twoslash
import { createClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const client = createClient({
  chain: mainnet,
  transport: http(),
})
```

## Extending with actions

`.extend` folds a set of actions onto the Client. Every action in
`@tronweb3/tviem/actions` is a standalone function taking `(client, parameters)`,
so you can wire up exactly the ones you use — and the bundler drops the rest.

```ts twoslash
import { createClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
import { getBalance, getNowBlock } from '@tronweb3/tviem/actions'

const client = createClient({
  chain: mainnet,
  transport: http(),
}).extend((client) => ({ // [!code focus:4]
  getBalance: (args: { address: `T${string}` }) => getBalance(client, args),
  getNowBlock: () => getNowBlock(client, {}),
}))

const balance = await client.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

This is the same mechanism `createPublicClient` uses internally — it calls
`createClient` and extends it with the full public action set.

## Adding your own helpers

`.extend` is not limited to tviem's actions. Anything you put on the returned
object becomes part of the Client's type:

```ts twoslash
import { createClient, formatTrx, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
import { getBalance } from '@tronweb3/tviem/actions'

const client = createClient({
  chain: mainnet,
  transport: http(),
}).extend((client) => ({
  /** Balance as a display string, not SUN. */
  async getBalanceInTrx(address: `T${string}`) { // [!code focus:4]
    const sun = await getBalance(client, { address })
    return formatTrx(sun)
  },
}))

const trx = await client.getBalanceInTrx('TTokenContractDemoxxxxxxxxxxxxxxxx')
//    ^?
```

Calls to `.extend` chain, so you can layer a shared base client with per-module
additions.

## Parameters

### chain

- **Type:** `Chain`

### transport

- **Type:** `Transport`

### account (optional)

- **Type:** `TronAccount | AccountKey`

### key (optional)

- **Type:** `string`
- **Default:** `"base"`

### name (optional)

- **Type:** `string`
- **Default:** `"Base Client"`

### pollingInterval (optional)

- **Type:** `number`

### cacheTime (optional)

- **Type:** `number`
