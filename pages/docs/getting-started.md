---
description: Get started with tviem in under five minutes.
title: Getting Started
---

# Getting Started

## Overview

tviem is a TypeScript interface for TRON that provides low-level primitives for
interacting with FullNodes and SolidityNodes. You can get started in a few
lines.

:::info
Everything identifying in these docs is a placeholder. Addresses read
`TTokenContractDemo…`, `TSenderAccountDemo…`, `TRecipientAccountDemo…`; private
keys count up from `0x…0001`. They have the right shape and length, so examples
type-check and read naturally — but the addresses carry no valid Base58Check
checksum, and the keys are the first two integers. Substitute your own.
:::

## Installation

Install tviem with your package manager of choice.

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

## Set up your Client & Transport

First, set up your [Client](/docs/clients/intro) with a desired
[Transport](/docs/clients/transports/http) and [Chain](/docs/chains/intro).

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
```

The **Transport** is the intermediary layer responsible for executing requests.
Today tviem ships one: [`http`](/docs/clients/transports/http), which talks to
TRON's HTTP API.

The **Chain** carries the node URLs and native currency metadata. tviem ships
`mainnet`, `nile` and `shasta`; see [Chains](/docs/chains/intro).

The **Client** binds the two together and exposes actions. A
[Public Client](/docs/clients/public) exposes reads; a
[Wallet Client](/docs/clients/wallet) exposes writes.

## Consume Actions

Now that you have a Client, you can consume
[Actions](/docs/actions/public/introduction).

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
// ---cut---
const balance = await publicClient.getBalance({ // [!code focus:3]
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

Balances come back in **SUN**, TRON's smallest unit — 1 TRX is 1,000,000 SUN.
Format it for display with [`formatTrx`](/docs/utilities/units):

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
// ---cut---
import { formatTrx } from '@tronweb3/tviem'

const balance = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

const trx = formatTrx(balance) // [!code focus]
```

## Sending your first transaction

Writes need a [Wallet Client](/docs/clients/wallet) with an
[Account](/docs/accounts/intro) attached.

```ts twoslash
<!--@include: ../../snippets/walletClient.ts-->
```

:::warning
Never hard-code a private key in code that ships. Read it from an environment
variable or a secrets manager, or use [`toAccount`](/docs/accounts/toAccount) to
delegate signing to a wallet or HSM.
:::

Then send TRX. Amounts are in SUN, so use
[`parseTrx`](/docs/utilities/units) to convert from a human figure:

```ts twoslash
<!--@include: ../../snippets/walletClient.ts-->
// ---cut---
import { parseTrx } from '@tronweb3/tviem'

const { txID } = await walletClient.sendTrx({ // [!code focus:4]
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: parseTrx('1'),
})
```

`sendTrx` returns as soon as the node accepts the broadcast. That is not the
same as the transaction having executed — to learn the outcome, wait for the
receipt:

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
// ---cut---
const receipt = await publicClient.waitForTransactionReceipt({
  hash: '2b6653dc...',
})
```

By default that waits for a **solidified** (irreversible) receipt. Pass
`confirmed: false` to return as soon as the transaction is packed — enough to
learn whether it succeeded, but the block can still be reorganized away. See
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt).

## Calling a contract

TRC-20 is ABI-compatible with ERC-20, so a standard ABI works. Declare it with
`as const` so tviem can infer argument and return types:

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
<!--@include: ../../snippets/trc20Abi.ts-->
// ---cut---
const balance = await publicClient.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})
```

Writing to a contract works the same way through the Wallet Client:

```ts twoslash
<!--@include: ../../snippets/walletClient.ts-->
<!--@include: ../../snippets/trc20Abi.ts-->
// ---cut---
const { txID } = await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})
```

`feeLimit` caps what you are willing to burn on energy for this call. Without
it the node applies its own default, which may be lower than your call needs.

## Next steps

- [Building a dApp](/docs/guides/dapp) — the read-heavy path, end to end
- [Building a Wallet](/docs/guides/wallet) — signing, multi-sig, offline flows
- [Build vs. Send](/docs/guides/build-vs-send) — when to stop before broadcast
- [Addresses](/docs/guides/addresses) — TRON's three address forms
- [Resources & Staking](/docs/guides/resources) — energy and bandwidth
