---
description: Frequently asked questions about tviem.
title: FAQ
---

# FAQ

## Why does everything use `bigint`?

TRX is quoted in SUN, with 6 decimals, and TRC-20 tokens routinely use 18. Those
values exceed what a JavaScript `number` represents exactly, and decimal strings
do not survive arithmetic. `bigint` is the only primitive that gets this right,
so tviem uses it everywhere an on-chain integer appears.

Use [`parseTrx`](/docs/utilities/units) and
[`formatTrx`](/docs/utilities/units) at the boundaries with your UI.

## What is the difference between a FullNode and a SolidityNode?

A FullNode serves the chain head — the latest state, which can still be
reorganized. A SolidityNode serves only **solidified** (irreversible) state,
which trails the head by roughly 20 blocks.

Read actions that can be answered from either take a `confirmed` flag. The
default differs by action, because the useful default differs:

- [`getBalance`](/docs/actions/public/getBalance),
  [`getBlock`](/docs/actions/public/getBlock),
  [`getTransactionInfo`](/docs/actions/public/getTransactionInfo) default to
  `confirmed: false` — the freshest answer.
- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt)
  defaults to `confirmed: true` — if you are waiting, you usually want finality.

## Why are there two spellings of the transaction id?

Because the TRON node uses both, and tviem does not silently rewrite node
responses.

- [`sendTrx`](/docs/actions/wallet/sendTrx),
  [`writeContract`](/docs/actions/wallet/writeContract) and the other
  build-and-broadcast actions return **`txID`**, matching TRON's transaction
  model.
- [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction) returns
  **`txid`**, matching the broadcast endpoint's response body.

Both are the same 32-byte hash, hex-encoded without a `0x` prefix.

## Why does my contract call return `unknown`?

Almost always a missing `as const` on the ABI:

```ts
// ❌ widens to `unknown`
const abi = [ /* … */ ]

// ✅ inferred
const abi = [ /* … */ ] as const
```

The second most common cause is `strict: false` in your `tsconfig.json`. tviem's
inference relies on `strict` being on. See [TypeScript](/docs/guides/typescript).

## Do I need an API key?

For a public endpoint like TronGrid, not to get started — but you will be rate
limited. Pass a key through the transport:

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    apiKey: process.env.TRONGRID_API_KEY,
  }),
})
```

## Why did my contract call fail with an out-of-energy error?

TRON charges energy for TVM execution, and `feeLimit` caps how much TRX you will
burn buying it. If the cap is below what the call consumes, the transaction is
packed but reverts.

Estimate first with
[`estimateEnergy`](/docs/actions/public/estimateEnergy), and set `feeLimit`
accordingly. See [Resources & Staking](/docs/guides/resources).

## Can I use tviem with TronLink or another injected wallet?

Yes — build an account with [`toAccount`](/docs/accounts/toAccount), which takes
your own signing functions rather than a private key. The wallet keeps the key;
tviem builds the transaction and hands it over for signature.

## Is tviem a drop-in replacement for TronWeb?

No. The APIs are shaped differently on purpose. See
[Migrating from TronWeb](/docs/guides/tronweb-migration) for a side-by-side
mapping.

## How do I talk to a private or local node?

Pass the URL to [`http`](/docs/clients/transports/http), and if your node splits
FullNode and SolidityNode across hosts, set `solidityUrl` too:

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('http://127.0.0.1:8090', {
    solidityUrl: 'http://127.0.0.1:8091',
  }),
})
```

For a chain that is not one of the three built in, define your own with
[`defineChain`](/docs/chains/defineChain).
