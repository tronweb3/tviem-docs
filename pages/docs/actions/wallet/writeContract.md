---
description: Call a state-changing contract function.
title: writeContract
---

# writeContract

Calls a `nonpayable` or `payable` function on a TVM contract. Builds, signs and
broadcasts.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const { txID } = await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})
```

`functionName` is narrowed to the state-changing functions in your ABI, and
`args` is typed from that function's inputs — a wrong name, a wrong arity or a
wrong type is a compile error.

## Returns

`BuildAndBroadcastReturnType`

A returned `txID` means the broadcast was accepted. A contract call can still
revert during execution, which shows up in the receipt:

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const { txID } = await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })
if (receipt.status === 'reverted') {
  // Energy was still burned.
}
```

## Parameters

### address

- **Type:** `` `T${string}` ``

The contract's Base58Check address.

### abi

- **Type:** `Abi`

The contract ABI, declared `as const`.

### functionName

- **Type:** `string`

### args

- **Type:** inferred from the ABI

Required when the function takes arguments, omitted when it does not.

### feeLimit (optional)

- **Type:** `bigint`

The maximum TRX, in SUN, you are willing to burn buying energy for this call.
Without it the node applies its own default, which may be below what your call
needs — in which case the transaction is packed and reverts.

Size it from [`estimateEnergy`](/docs/actions/public/estimateEnergy):

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
import { getEnergyFee } from '@tronweb3/tviem'

const call = {
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
} as const

const energy = await publicClient.estimateEnergy({ account, ...call })
const energyFee = getEnergyFee(await publicClient.getChainParameters())

await walletClient.writeContract({
  ...call,
  feeLimit: (energy * energyFee * 120n) / 100n, // [!code focus]
})
```

### callValue (optional)

- **Type:** `bigint`

TRX to attach to the call, in SUN. Only meaningful for a `payable` function.

### callTokenValue (optional)

- **Type:** `bigint`

TRC-10 asset amount to attach.

### tokenId (optional)

- **Type:** `bigint`

The TRC-10 asset id that `callTokenValue` refers to.

### account (optional)

- **Type:** `TronAccount | AccountKey`

### memo (optional)

- **Type:** `MemoInput`

### expirationMs (optional)

- **Type:** `bigint | number`

### blockHeader (optional)

- **Type:** `TransactionHeader`

## Building without sending

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const unsigned = await walletClient.buildWriteContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})
```

## Related

- [`readContract`](/docs/actions/public/readContract) — `view` and `pure` calls
- [`getContract`](/docs/contract/getContract) — bind address and ABI once
- [`deployContract`](/docs/actions/wallet/deployContract)
