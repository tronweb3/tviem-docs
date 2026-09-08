---
description: Read the chain's dynamic parameters.
title: getChainParameters
---

# getChainParameters

Reads the chain's dynamic parameters — the values super representatives vote on,
such as energy price, bandwidth price and per-transaction fees.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const parameters = await publicClient.getChainParameters()
//    ^?
```

## Returns

`Record<string, bigint>`

A map of parameter key to value. Keys are TRON's own names, such as
`getEnergyFee` and `getTransactionFee`. Parameters the node returns without a
value (zero-valued) map to `0n`.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const parameters = await publicClient.getChainParameters()

// SUN per unit of energy.
const energyFee = parameters.getEnergyFee

// SUN per byte of bandwidth.
const transactionFee = parameters.getTransactionFee
```

## Typed shortcuts

Two parameters are needed often enough to have their own getters. They are
synchronous pure functions over the map you already fetched — not actions, so
they take the parameters rather than the Client, and fall back to `0n` when the
key is absent:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
import { getEnergyFee, getTransactionFee } from '@tronweb3/tviem'

const parameters = await publicClient.getChainParameters()

// SUN per unit of energy.
const energyFee = getEnergyFee(parameters)
//    ^?

// SUN per byte of bandwidth.
const bandwidthFee = getTransactionFee(parameters)
```

## Parameters

None.

## Related

- [`estimateEnergy`](/docs/actions/public/estimateEnergy) — energy for a
  specific call, which you price with `getEnergyFee`
