---
description: An introduction to Public Actions.
title: Public Actions
---

# Public Actions

Public Actions read from TRON. They are available on a
[Public Client](/docs/clients/public), and never sign or broadcast anything.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const balance = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## FullNode or SolidityNode

Most read actions take a `confirmed` flag choosing which node answers:

- `confirmed: false` — the **FullNode**, serving the chain head. Freshest, but
  the answer can be reorganized away.
- `confirmed: true` — the **SolidityNode**, serving solidified (irreversible)
  state, which trails the head by roughly 20 blocks.

The default is `false` for point reads and `true` for
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt),
because that is the useful default in each case.

## Actions

### Account

| Action                                                              | Returns                          |
| ------------------------------------------------------------------- | -------------------------------- |
| [`getBalance`](/docs/actions/public/getBalance)                      | TRX balance in SUN               |
| [`getAccount`](/docs/actions/public/getAccount)                      | Full account state, or `null`    |
| [`getAccountResources`](/docs/actions/public/getAccountResources)    | Bandwidth, energy, TRON power    |

### Block

| Action                                                | Returns          |
| ----------------------------------------------------- | ---------------- |
| [`getBlock`](/docs/actions/public/getBlock)            | A block by number |
| [`getNowBlock`](/docs/actions/public/getNowBlock)      | The latest block  |

### Transaction

| Action                                                                            | Returns                        |
| --------------------------------------------------------------------------------- | ------------------------------ |
| [`getTransaction`](/docs/actions/public/getTransaction)                            | The transaction, or `null`     |
| [`getTransactionInfo`](/docs/actions/public/getTransactionInfo)                    | The receipt, or `null`         |
| [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt)      | The receipt, once available    |

### Contract

| Action                                                        | Returns                            |
| ------------------------------------------------------------- | ---------------------------------- |
| [`readContract`](/docs/actions/public/readContract)            | A `view` / `pure` call's result    |
| [`estimateEnergy`](/docs/actions/public/estimateEnergy)        | Energy a call would consume        |
| `triggerConstantContract`                                      | The raw constant-call response     |
| [`getLogs`](/docs/actions/public/getLogs)                      | Decoded event logs                 |

### Chain

| Action                                                              | Returns                         |
| ------------------------------------------------------------------- | ------------------------------- |
| [`getChainParameters`](/docs/actions/public/getChainParameters)      | The chain's dynamic parameters  |

### Multi-signature

| Action             | Returns                                            |
| ------------------ | -------------------------------------------------- |
| `getSignWeight`    | Accumulated signature weight for a transaction      |
| `getApprovedList`  | Addresses that have already signed                  |

## Standalone imports

Every action is also importable on its own, taking the client as its first
argument. This is what lets a bundler drop the ones you do not use:

```ts twoslash
import { createClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
import { getBalance } from '@tronweb3/tviem/actions'

const client = createClient({ chain: mainnet, transport: http() })

const balance = await getBalance(client, {
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

See [Build your own Client](/docs/clients/custom).
