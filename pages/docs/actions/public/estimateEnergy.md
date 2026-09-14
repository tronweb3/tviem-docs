---
description: Estimate the energy a contract call would consume.
title: estimateEnergy
---

# estimateEnergy

Estimates the energy a contract call would consume, using the real caller's
on-chain state.

Use it to size the `feeLimit` on a [`writeContract`](/docs/actions/wallet/writeContract)
call. Set the cap too low and the transaction is packed but reverts, burning
energy for nothing.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const energy = await publicClient.estimateEnergy({
//    ^?
  account,
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
})
```

## Returns

`bigint`

Energy units required. This is **not** SUN — to convert to a TRX cost, multiply
by the network's energy price, which you can read from
[`getChainParameters`](/docs/actions/public/getChainParameters):

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
import { getEnergyFee } from '@tronweb3/tviem'

const energy = await publicClient.estimateEnergy({
  account,
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
})

// SUN per unit of energy.
const energyFee = getEnergyFee(await publicClient.getChainParameters())

// What the call costs if you have no staked energy at all.
const worstCaseSun = energy * energyFee
```

## Sizing a feeLimit

Estimates are made against current state, and state moves. Add headroom:

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
import { getEnergyFee } from '@tronweb3/tviem'

const energy = await publicClient.estimateEnergy({
  account,
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
})

const energyFee = getEnergyFee(await publicClient.getChainParameters())

// 20% headroom.
const feeLimit = (energy * energyFee * 120n) / 100n

await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit, // [!code focus]
})
```

## Parameters

Takes the same call shape as
[`writeContract`](/docs/actions/wallet/writeContract) — `address`, `abi`,
`functionName`, `args` — plus:

### account

- **Type:** `TronAccount | AccountKey`

The caller. Required unless the Client hoists an account — and a
[Public Client](/docs/clients/public) cannot, so on one this is always required;
without it the call throws `AccountNotFoundError`.

Energy cost depends on who calls — a first write to a storage slot
costs more than an update, and the caller's own state decides that. Passing a
different account than the one that will send gives you an estimate for the
wrong transaction.

### callValue (optional)

- **Type:** `bigint`

TRX to attach to the call, in SUN.

## Related

- [`getAccountResources`](/docs/actions/public/getAccountResources) — energy you
  already have from staking
- [Resources & Staking](/docs/guides/resources)
