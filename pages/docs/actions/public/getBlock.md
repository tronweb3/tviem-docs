---
description: Fetch a block by number.
title: getBlock
---

# getBlock

Fetches a block by its number.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const block = await publicClient.getBlock({ blockNumber: 60_000_000n })
//    ^?
```

## Returns

`Block`

| Field            | Type                | Meaning                                |
| ---------------- | ------------------- | -------------------------------------- |
| `blockID`        | `string`            | Block hash (64 hex chars, no `0x`)      |
| `number`         | `bigint`            | Block height                            |
| `timestamp`      | `bigint`            | Block timestamp in ms                   |
| `parentHash`     | `string`            | Previous block's hash                   |
| `txTrieRoot`     | `string`            | Transaction trie root                   |
| `witnessAddress` | `` `T${string}` ``  | The super representative that produced it |
| `version`        | `number`            | Block version                           |
| `transactions`   | `readonly unknown[]`| Transactions included                   |

tviem verifies that the block it got back is the one you asked for, and throws
`BlockTamperedError` if the height does not match.

## Parameters

### blockNumber

- **Type:** `bigint | number`

The block height to fetch. Both `bigint` and `number` are accepted.

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read from the SolidityNode instead of the FullNode. A block close to the head
has not solidified yet, so this throws `BlockNotFoundError` for recent heights.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const block = await publicClient.getBlock({
  blockNumber: 60_000_000n,
  confirmed: true, // [!code focus]
})
```

## Errors

| Error                  | When                                              |
| ---------------------- | ------------------------------------------------- |
| `BlockNotFoundError`   | The node returned an empty body — unknown block    |
| `BlockTamperedError`   | The returned block is not at the requested height  |
| `TronRpcError`         | The node returned a malformed block body           |

## Related

- [`getNowBlock`](/docs/actions/public/getNowBlock) — the current head
