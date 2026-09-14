---
description: How tviem's type inference works, and how to keep it working.
title: TypeScript
---

# TypeScript

tviem's types are the point, not decoration. This page covers what makes them
work and the two or three ways they stop working.

## Requirements

TypeScript is an optional peer dependency, declared as **`>=5.4.0`**.

`strict` mode is required for inference to work:

```json [tsconfig.json]
{
  "compilerOptions": {
    "strict": true
  }
}
```

Without it, ABI inference degrades and contract calls widen to `unknown`.

## `as const` on ABIs

This is the single most important rule. An ABI must be `as const` for tviem to
read it at the type level:

```ts twoslash
// @errors: 2769
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
// ❌ widened to `{ type: string; name: string; ... }[]`
const abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
]

const balance = await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})
```

With `as const`, the literal types survive and everything is inferred:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
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

## What gets inferred

From one `as const` ABI:

- **`functionName`** narrows to the functions that exist, in the right state
  mutability group. [`readContract`](/docs/actions/public/readContract) offers
  only `view` and `pure`;
  [`writeContract`](/docs/actions/wallet/writeContract) only `nonpayable` and
  `payable`.
- **`args`** is typed from that function's inputs — arity and types both.
- **The return value** is typed from its outputs.
- **`args` disappears** entirely for a function that takes none.

```ts twoslash
// @errors: 2322
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
// `transfer` is nonpayable, so it is not offered to readContract.
await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
})
```

## Addresses are branded

`Address` is `` `T${string}` ``, a template literal type acting as a lightweight
brand. A plain `string` is not assignable, but a literal is:

```ts twoslash
// @errors: 2322
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
declare const fromUserInput: string

await publicClient.getBalance({ address: fromUserInput })
```

Use [`isAddress`](/docs/utilities/address) as the guard that turns one into the
other:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
import { isAddress } from '@tronweb3/tviem'

declare const fromUserInput: string

if (isAddress(fromUserInput)) {
  await publicClient.getBalance({ address: fromUserInput })
}
```

The brand is not just pedantry — it stops an EVM-form `0x…` address, which is a
perfectly good string, from reaching an API that needs Base58Check.

## Every unsigned integer is `bigint`

Including narrow ones. `uint8` decodes to `bigint`, not `number` — a deliberate
departure from abitype's default, which maps `uint8` through `uint48` to
`number`.

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
const decimals = await publicClient.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'decimals',
})
```

Convert at the boundary where an API wants a `number`:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { formatUnits } from '@tronweb3/tviem'

declare const balance: bigint
const decimals = await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'decimals',
})

const display = formatUnits(balance, Number(decimals))
```

## Chains keep their literal types

[`defineChain`](/docs/chains/defineChain) preserves what you pass, so chain
fields narrow rather than widening:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
publicClient.chain.id
//                 ^?
```

## Error types

Every action exports an `ErrorType` union naming what it can throw:

```ts twoslash
import type { GetBalanceErrorType, SendTrxErrorType } from '@tronweb3/tviem'
```

These are types, not classes — useful for exhaustive handling in a wrapper. See
[Error Handling](/docs/guides/error-handling).

## Sharing an ABI across a codebase

Declare it once, export it, and every call site infers from the same source:

```ts twoslash
// @filename: abi.ts
export const trc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const
// @filename: index.ts
// ---cut---
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
import { trc20Abi } from './abi.js'

const client = createPublicClient({ chain: mainnet, transport: http() })

const balance = await client.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})
```

## When inference is slow

A very large ABI can make the compiler work hard. If your editor gets sluggish:

- Narrow the ABI to the functions you actually call. You rarely need all of a
  contract's fragments.
- Bind it once with [`getContract`](/docs/contract/getContract) instead of
  re-inferring at every call site.
