---
description: Read an account's full on-chain state.
title: getAccount
---

# getAccount

Reads an account's full on-chain state — balance, resource usage, permissions
and timestamps.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const account = await publicClient.getAccount({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## Returns

`AccountState | null`

`null` when the account does not exist on chain — TRON creates accounts lazily,
so an address that has never received anything has no state.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const account = await publicClient.getAccount({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

if (account === null) {
  // Never funded.
} else {
  account.balance
  //      ^?
}
```

Selected fields:

| Field                    | Type                                     | Meaning                                  |
| ------------------------ | ---------------------------------------- | ---------------------------------------- |
| `address`                | `` `T${string}` ``                       | Base58Check address                       |
| `type`                   | `'Normal' \| 'AssetIssue' \| 'Contract'` | What kind of account this is              |
| `balance`                | `bigint`                                 | TRX balance in SUN                        |
| `createTime`             | `bigint`                                 | Creation timestamp (ms)                   |
| `isWitness`              | `boolean`                                | Whether the account is a super representative |
| `netUsage` / `freeNetUsage` | `bigint`                              | Bandwidth consumed, paid and free         |
| `energyUsage`            | `bigint`                                 | Energy consumed                           |
| `allowance`              | `bigint`                                 | Withdrawable reward (SUN)                 |
| `latestWithdrawTime`     | `bigint`                                 | Last reward withdrawal (ms)               |

Every integer is a `bigint`, and TRON omits zero-valued fields from its
response — those map to `0n` rather than going missing.

## Parameters

### address

- **Type:** `` `T${string}` ``

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read from the SolidityNode instead of the FullNode.

## Related

- [`getBalance`](/docs/actions/public/getBalance) — just the TRX balance
- [`getAccountResources`](/docs/actions/public/getAccountResources) — the
  resource budget, with limits as well as usage
