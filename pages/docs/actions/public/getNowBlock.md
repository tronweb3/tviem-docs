---
description: Fetch the latest block.
title: getNowBlock
---

# getNowBlock

Fetches the chain's latest block.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const block = await publicClient.getNowBlock()
//    ^?
```

## Returns

`Block`

The same shape as [`getBlock`](/docs/actions/public/getBlock).

Reading just the height:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const { number } = await publicClient.getNowBlock()
//      ^?
```

## Parameters

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read the latest **solidified** block from the SolidityNode instead of the
FullNode's head. The solidified head trails the chain head by roughly 20 blocks,
which is exactly the gap you can use to reason about finality:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const head = await publicClient.getNowBlock()
const solid = await publicClient.getNowBlock({ confirmed: true })

const blocksUntilFinal = head.number - solid.number
```

## Related

- [`getBlock`](/docs/actions/public/getBlock) — a specific height
- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) —
  waiting on a transaction rather than polling heads yourself
