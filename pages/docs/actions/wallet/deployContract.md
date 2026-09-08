---
description: Deploy a TVM contract.
title: deployContract
---

# deployContract

Deploys a contract, and returns its address along with the broadcast result.

## Usage

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const abi = [
  { type: 'constructor', inputs: [{ name: 'owner', type: 'address' }] },
] as const

const { txID, contractAddress } = await walletClient.deployContract({
  abi,
  bytecode: '0x60806040...',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
  feeLimit: 1_000_000_000n,
})
```

## Returns

`BuildAndBroadcastReturnType & { contractAddress }`

`contractAddress` is computed locally from the deployer's address and the
transaction — it is available immediately, before the deployment has executed.
That means it is the address the contract *will* have if the deployment
succeeds, not proof that it did.

Confirm before using it:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/clients.ts-->
declare const abi: readonly []
declare const bytecode: `0x${string}`
// ---cut---
const { txID, contractAddress } = await walletClient.deployContract({
  abi,
  bytecode,
  feeLimit: 1_000_000_000n,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })
if (receipt.status === 'reverted') throw new Error('deployment reverted')

// Now `contractAddress` is real.
```

## Parameters

### abi

- **Type:** `Abi`

The contract ABI, declared `as const`. Its `constructor` fragment types `args`.

### bytecode

- **Type:** `` `0x${string}` ``

The compiled creation bytecode.

### args (optional)

- **Type:** inferred from the ABI's constructor

Constructor arguments. Required when the constructor takes any.

### feeLimit (optional)

- **Type:** `bigint`

Maximum SUN to burn on energy. Deployments are energy-hungry — a non-trivial
contract can exceed the node's default limit, so set this explicitly.

### callValue (optional)

- **Type:** `bigint`

TRX to send to the constructor, in SUN. Only for a `payable` constructor.

### name (optional)

- **Type:** `string`

A contract name recorded on chain, shown by explorers.

### account (optional)

- **Type:** `TronAccount | AccountKey`

### expirationMs (optional)

- **Type:** `bigint | number`

### blockHeader (optional)

- **Type:** `TransactionHeader`

## Building without deploying

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
declare const abi: readonly []
declare const bytecode: `0x${string}`
// ---cut---
const unsigned = await walletClient.buildDeployContract({
  abi,
  bytecode,
  feeLimit: 1_000_000_000n,
})
```

## Related

- [`writeContract`](/docs/actions/wallet/writeContract) — calling the deployed
  contract
- [`getContract`](/docs/contract/getContract) — binding it for reuse
