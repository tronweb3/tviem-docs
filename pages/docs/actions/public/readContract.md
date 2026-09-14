---
description: Call a view or pure contract function.
title: readContract
---

# readContract

Calls a `view` or `pure` function on a TVM contract. Nothing is broadcast and no
fee is charged.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
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

The return type is inferred from the ABI — `balanceOf` returns `uint256`, so you
get a `bigint`.

Note the `account`: it is the caller the node executes the read as, and tviem
never defaults it. A Public Client has no account to fall back on, so every read
through one must pass it — see [`account`](#account) below.

A function with no arguments omits `args` entirely:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const symbol = await publicClient.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'symbol',
})
```

## Returns

The decoded return value, typed from the ABI. A single output decodes to that
value; multiple outputs decode to a tuple.

## Parameters

### address

- **Type:** `` `T${string}` ``

The contract's Base58Check address.

### account

- **Type:** `TronAccount | AddressInput`

The caller — the address the node executes the call as (`owner_address`).

tviem never defaults this: a `view` function's result can depend on who asks
(`msg.sender`), so guessing a caller would silently return the wrong answer.
It is resolved from the per-call `account`, falling back to the Client's hoisted
account; with neither, the call throws `AccountNotFoundError`.

A [Public Client](/docs/clients/public) cannot hoist an account —
`createPublicClient` does not accept one — so on a Public Client `account` is
required on every call.

### abi

- **Type:** `Abi`

The contract ABI. Declare it `as const` — without that, TypeScript widens the
array and `functionName`, `args` and the return type all collapse to `unknown`.

### functionName

- **Type:** `string`

The function to call. Narrowed to the `view` and `pure` functions in your ABI,
so a typo or a `nonpayable` function is a compile error:

```ts twoslash
// @errors: 2322
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const result = await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
})
```

### args (optional)

- **Type:** inferred from the ABI

The function arguments, typed from the ABI's inputs. Required when the function
takes any; omitted when it does not.

Solidity `address` parameters accept TRON's Base58Check form — tviem converts to
the EVM form for you.

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Execute against solidified state on the SolidityNode.

## Errors

A reverting `view` call throws. Wrap it if a revert is an expected outcome:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
try {
  await publicClient.readContract({
    address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
    account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
    abi: trc20Abi,
    functionName: 'balanceOf',
    args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
  })
} catch (error) {
  // Reverted, or the address is not a contract.
}
```

See [Error Handling](/docs/guides/error-handling).

## Related

- [`getContract`](/docs/contract/getContract) — bind an address and ABI once
- [`writeContract`](/docs/actions/wallet/writeContract) — state-changing calls
- [`estimateEnergy`](/docs/actions/public/estimateEnergy) — cost of a write
