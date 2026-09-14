---
description: Bind a contract's address and ABI once, then call it.
title: getContract
---

# getContract

Binds an address, an ABI and a Client into a single object, so you stop
repeating them on every call.

## Usage

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { getContract } from '@tronweb3/tviem'

const contract = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: publicClient,
})

const symbol = await contract.read.symbol({ account })
//    ^?
```

The `read`, `write` and `estimateEnergy` groups are built from the ABI, so
autocomplete lists exactly the functions the contract has — and only the ones in
the right state mutability group.

## Read and write from one object

Pass a Client that can do both and you get both groups:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { getContract } from '@tronweb3/tviem'

const contract = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: walletClient,
})

const { txID } = await contract.write.transfer(
  ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  { feeLimit: 100_000_000n },
)
```

Write functions take `(args, options)` — the arguments as a tuple, then the
transaction options (`feeLimit`, `callValue`, `account`, …).

## What is available depends on the Client

The groups are derived from what the Client can actually do:

| Client                                    | `read` | `write` | `estimateEnergy` | `getEvents` |
| ------------------------------------------ | ------ | ------- | ---------------- | ----------- |
| [Public](/docs/clients/public)              | ✓      |         |                  | ✓           |
| [Wallet](/docs/clients/wallet)              |        | ✓       | ✓                | ✓           |

Asking a Public-Client-backed contract to write is a compile error, not a
runtime one:

```ts twoslash
// @errors: 2339
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
import { getContract } from '@tronweb3/tviem'
// ---cut---
const contract = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: publicClient,
})

await contract.write.transfer(
  ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  {},
)
```

## Events

`getEvents` is keyed by the events in your ABI:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
import { getContract } from '@tronweb3/tviem'
// ---cut---
const contract = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: publicClient,
})

const logs = await contract.getEvents.Transfer()
```

The address is already bound, so unlike
[`getLogs`](/docs/actions/public/getLogs) you do not repeat it.

## Estimating energy

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
import { getContract } from '@tronweb3/tviem'
// ---cut---
const contract = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: walletClient,
})

const energy = await contract.estimateEnergy.transfer(
  ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  {},
)
```

## Returns

An object carrying `abi`, `address`, `getEvents`, and whichever of `read`,
`write` and `estimateEnergy` the Client supports.

## Parameters

### address

- **Type:** `` `T${string}` ``

The contract's Base58Check address.

### abi

- **Type:** `Abi`

The contract ABI, declared `as const`.

### client

- **Type:** `Client`

A [Public](/docs/clients/public) or [Wallet](/docs/clients/wallet) Client.

## Related

- [`readContract`](/docs/actions/public/readContract)
- [`writeContract`](/docs/actions/wallet/writeContract)
- [`deployContract`](/docs/actions/wallet/deployContract)
