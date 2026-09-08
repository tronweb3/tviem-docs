---
description: Set up a Public Client to read from TRON.
title: Public Client
---

# Public Client

A Public Client is an interface to TRON's read methods — balances, accounts,
blocks, transactions, receipts, logs and `view` contract calls. It is created
with [`createPublicClient`](#createpublicclient).

## Import

```ts twoslash
import { createPublicClient } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
```

Then consume [Public Actions](/docs/actions/public/introduction):

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
const block = await publicClient.getNowBlock() // [!code focus]
```

## Parameters

### chain

- **Type:** `Chain`

The [Chain](/docs/chains/intro) of the Client.

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet, // [!code focus]
  transport: http(),
})
```

### transport

- **Type:** `Transport`

The [Transport](/docs/clients/transports/http) of the Client.

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(), // [!code focus]
})
```

### key (optional)

- **Type:** `string`
- **Default:** `"public"`

A key for the Client.

### name (optional)

- **Type:** `string`
- **Default:** `"Public Client"`

A name for the Client.

### pollingInterval (optional)

- **Type:** `number`
- **Default:** the chain's `blockTime`

Frequency (in ms) for polling enabled actions, such as
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt).

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  pollingInterval: 3_000, // [!code focus]
  transport: http(),
})
```

### cacheTime (optional)

- **Type:** `number`
- **Default:** `pollingInterval`

Time (in ms) that cached data stays fresh.

## Available actions

| Group       | Actions                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Account     | [`getBalance`](/docs/actions/public/getBalance), [`getAccount`](/docs/actions/public/getAccount), [`getAccountResources`](/docs/actions/public/getAccountResources) |
| Block       | [`getBlock`](/docs/actions/public/getBlock), [`getNowBlock`](/docs/actions/public/getNowBlock)          |
| Transaction | [`getTransaction`](/docs/actions/public/getTransaction), [`getTransactionInfo`](/docs/actions/public/getTransactionInfo), [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) |
| Contract    | [`readContract`](/docs/actions/public/readContract), [`estimateEnergy`](/docs/actions/public/estimateEnergy), `triggerConstantContract`, [`getLogs`](/docs/actions/public/getLogs) |
| Chain       | [`getChainParameters`](/docs/actions/public/getChainParameters)                                         |
| Multi-sig   | `getSignWeight`, `getApprovedList`                                                                     |
