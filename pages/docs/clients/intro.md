---
description: An introduction to Clients and Transports in tviem.
title: Clients & Transports
---

# Clients & Transports

## Clients

A **Client** is the object you call actions on. It holds three things:

- a **Chain** — which network, and the node URLs to reach it
- a **Transport** — how requests are executed
- optionally an **Account** — who signs

tviem ships two ready-made clients, plus the primitive they are both built on:

| Client                                       | Purpose                                     |
| -------------------------------------------- | ------------------------------------------- |
| [Public Client](/docs/clients/public)         | Reads: balances, blocks, receipts, `view` calls |
| [Wallet Client](/docs/clients/wallet)         | Writes: transfers, contract calls, signing  |
| [`createClient`](/docs/clients/custom)        | Bare client you extend yourself             |

The split is deliberate. A module that only reads takes a Public Client and
therefore cannot hold a key or broadcast anything — the type system enforces
what a code review would otherwise have to catch.

```ts twoslash
// @errors: 2339
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
// Reads are available:
await publicClient.getBalance({ address: 'TTokenContractDemoxxxxxxxxxxxxxxxx' })

// Writes are not:
await publicClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

## Transports

A **Transport** is the intermediary that actually performs a request. tviem
currently ships one:

- [`http`](/docs/clients/transports/http) — TRON's HTTP API, with configurable
  retries, timeouts, API key, and separate FullNode / SolidityNode / event
  endpoints.

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    apiKey: process.env.TRONGRID_API_KEY,
    retryCount: 3,
    timeout: 10_000,
  }),
})
```

Called with no URL, `http()` uses the URLs from the Chain you passed.

## FullNode and SolidityNode

TRON serves two views of the chain, and tviem keeps both reachable through one
Client:

- The **FullNode** serves the chain head — the latest state, still reorganizable.
- The **SolidityNode** serves solidified (irreversible) state, trailing the head
  by roughly 20 blocks.

Read actions that can be answered by either take a `confirmed` flag, so you pick
freshness or finality per call:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
// Latest state, from the FullNode.
const latest = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

// Solidified state, from the SolidityNode.
const settled = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  confirmed: true,
})
```

Point the two at different hosts with the transport's `solidityUrl` option.
