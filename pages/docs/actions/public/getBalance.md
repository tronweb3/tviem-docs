---
description: Read an account's TRX balance.
title: getBalance
---

# getBalance

Reads the TRX balance of an account, in **SUN**.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const balance = await publicClient.getBalance({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## Returns

`bigint`

The balance in SUN. 1 TRX is 1,000,000 SUN, so format for display with
[`formatTrx`](/docs/utilities/units):

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
import { formatTrx } from '@tronweb3/tviem'

const balance = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

const trx = formatTrx(balance) // [!code focus]
```

An account that does not exist on chain reads as `0n`, not an error.

## Parameters

### address

- **Type:** `` `T${string}` ``

The Base58Check address to read.

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read solidified state from the SolidityNode instead of the FullNode's latest
state. Solidified state trails the chain head, so a transfer made moments ago is
not reflected there yet.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const balance = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  confirmed: true, // [!code focus]
})
```

## TRC-20 balances

`getBalance` reads the native TRX balance only. For a token, call the contract:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const balance = await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})
```
