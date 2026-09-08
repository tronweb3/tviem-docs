---
description: Moving from TronWeb to tviem.
title: Migrating from TronWeb
---

# Migrating from TronWeb

tviem is not a drop-in replacement for TronWeb. The shapes differ deliberately.
This page maps the common operations across.

## The structural difference

TronWeb is one stateful object holding a node connection and a private key,
with everything hanging off it. tviem splits that into three:

| Concern              | TronWeb                        | tviem                                          |
| -------------------- | ------------------------------ | ---------------------------------------------- |
| Which network        | `fullHost` on the constructor  | [Chain](/docs/chains/intro)                     |
| How requests execute | Built in                       | [Transport](/docs/clients/transports/http)      |
| Who signs            | `privateKey` on the constructor | [Account](/docs/accounts/intro)                 |
| Reads                | `tronWeb.trx.*`                | [Public Client](/docs/clients/public)           |
| Writes               | `tronWeb.transactionBuilder.*` | [Wallet Client](/docs/clients/wallet)           |

The practical consequence: a module that only reads takes a Public Client and
therefore *cannot* hold a key or broadcast. With TronWeb that separation could
only be a convention.

## Setup

```ts
// TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: '59c6995e...',
})
```

```ts twoslash
// tviem
import {
  createPublicClient,
  createWalletClient,
  http,
  privateKeyToAccount,
} from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io'),
})

const walletClient = createWalletClient({
  account: privateKeyToAccount('0x0000000000000000000000000000000000000000000000000000000000000001'),
  chain: mainnet,
  transport: http('https://api.trongrid.io'),
})
```

:::warning
`0x…0001` is a placeholder, on both sides of this comparison. Read real keys from
an environment variable or a secrets manager.

One migration note worth acting on: TronWeb takes the key on the constructor, so
a single object both reads and signs. tviem splits them, and the split is only
worth anything if you use it — pass the Public Client to code that reads, and
keep the Wallet Client where signing actually belongs.
:::

## Reading

| TronWeb                                   | tviem                                                                |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `tronWeb.trx.getBalance(address)`         | [`publicClient.getBalance({ address })`](/docs/actions/public/getBalance) |
| `tronWeb.trx.getAccount(address)`         | [`publicClient.getAccount({ address })`](/docs/actions/public/getAccount) |
| `tronWeb.trx.getAccountResources(address)`| [`publicClient.getAccountResources({ address })`](/docs/actions/public/getAccountResources) |
| `tronWeb.trx.getCurrentBlock()`           | [`publicClient.getNowBlock()`](/docs/actions/public/getNowBlock)       |
| `tronWeb.trx.getBlockByNumber(n)`         | [`publicClient.getBlock({ blockNumber })`](/docs/actions/public/getBlock) |
| `tronWeb.trx.getTransaction(id)`          | [`publicClient.getTransaction({ hash })`](/docs/actions/public/getTransaction) |
| `tronWeb.trx.getTransactionInfo(id)`      | [`publicClient.getTransactionInfo({ hash })`](/docs/actions/public/getTransactionInfo) |
| `tronWeb.trx.getChainParameters()`        | [`publicClient.getChainParameters()`](/docs/actions/public/getChainParameters) |

Positional arguments become a named object throughout — with a dozen optional
parameters across the API, positions stop being readable.

### Balances are `bigint`

```ts
// TronWeb — a number, which loses precision above 2^53
const balance = await tronWeb.trx.getBalance(address)
```

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
// tviem — a bigint, exact
const balance = await publicClient.getBalance({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

This is the change most likely to surface in your code. Arithmetic on balances
must move to `bigint`, and `number` conversions have to be explicit.

## Writing

TronWeb's three-step build-sign-send has a direct equivalent, and a shorter one:

```ts
// TronWeb
const tx = await tronWeb.transactionBuilder.sendTrx(to, amount, from)
const signed = await tronWeb.trx.sign(tx)
const result = await tronWeb.trx.sendRawTransaction(signed)
```

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
// tviem — the same three steps
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
const signed = await walletClient.signTransaction({ transaction: unsigned })
const result = await walletClient.broadcastTransaction({
  signedTransaction: signed,
})
```

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
// …or all three at once
const result = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

Every write action has both forms. See
[Build vs. Send](/docs/guides/build-vs-send).

| TronWeb                                         | tviem                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `transactionBuilder.sendTrx(...)`                | [`buildSendTrx`](/docs/actions/wallet/sendTrx)                      |
| `transactionBuilder.sendToken(...)`              | `buildSendTrc10`                                                    |
| `transactionBuilder.triggerSmartContract(...)`   | [`buildWriteContract`](/docs/actions/wallet/writeContract)          |
| `transactionBuilder.createSmartContract(...)`    | [`buildDeployContract`](/docs/actions/wallet/deployContract)        |
| `transactionBuilder.freezeBalanceV2(...)`        | [`buildFreezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2)      |
| `transactionBuilder.delegateResource(...)`       | [`buildDelegateResource`](/docs/actions/wallet/delegateResource)    |
| `trx.sign(tx)`                                   | [`signTransaction`](/docs/actions/wallet/signTransaction)           |
| `trx.multiSign(tx, key, permissionId)`           | [`multiSign`](/docs/actions/wallet/multiSign)                       |
| `trx.sendRawTransaction(signed)`                 | [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction) |

## Contracts

This is the largest gain, and the largest change.

```ts
// TronWeb — untyped, returns any
const contract = await tronWeb.contract().at(address)
const balance = await contract.balanceOf(owner).call()
await contract.transfer(to, value).send({ feeLimit: 100_000_000 })
```

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
// tviem — inferred from the ABI
const balance = await publicClient.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})

await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})
```

There is no `.at()` round trip: tviem reads the ABI from your source, not from
the chain, so binding a contract is synchronous and fully typed.

For a TronWeb-like bound object, [`getContract`](/docs/contract/getContract) is
the closest analogue — with `read` and `write` groups typed from the ABI:

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

const balance = await contract.read.balanceOf([
  'TSenderAccountDemoxxxxxxxxxxxxxxxx',
])
```

## Addresses

| TronWeb                          | tviem                                              |
| -------------------------------- | -------------------------------------------------- |
| `tronWeb.address.fromHex(hex)`   | [`toBase58(hex)`](/docs/utilities/address)          |
| `tronWeb.address.toHex(base58)`  | [`addressToHex(base58)`](/docs/utilities/address)   |
| `tronWeb.isAddress(value)`       | [`isAddress(value)`](/docs/utilities/address)       |
| —                                | [`toEvm(address)`](/docs/utilities/address)         |
| —                                | [`isAddressEqual(a, b)`](/docs/utilities/address)   |

`isAddress` in tviem is a **type guard**, so it narrows `string` to
`` `T${string}` `` — which is what every action's `address` parameter requires.
That is the boundary where untrusted input becomes usable. See
[Addresses](/docs/guides/addresses).

## Units

| TronWeb                  | tviem                                        |
| ------------------------ | -------------------------------------------- |
| `tronWeb.toSun(trx)`     | [`parseTrx(trx)`](/docs/utilities/units)      |
| `tronWeb.fromSun(sun)`   | [`formatTrx(sun)`](/docs/utilities/units)     |

`parseTrx` takes a **string** and returns `bigint`; `formatTrx` takes `bigint`
and returns a string. Neither accepts or produces a `number` — passing a float
means precision was already lost before tviem saw it.

## Things to watch for

### Balances and amounts are `bigint`

`1_000_000n`, not `1000000`. Mixing `bigint` and `number` in arithmetic is a
`TypeError` at runtime and an error at compile time, so the compiler will find
these for you.

### A resolved promise is not success

Both libraries return once the node accepts the broadcast. Neither tells you the
transaction executed. Check the receipt:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })
if (receipt.status === 'reverted') throw new Error('reverted')
```

### `txID` vs. `txid`

Build-and-broadcast actions return `txID`; `broadcastTransaction` returns
`txid`. tviem mirrors what each TRON endpoint actually returns rather than
normalizing. See the [FAQ](/docs/faq).

### ABIs need `as const`

Without it, inference collapses and every contract call returns `unknown` — the
TronWeb experience, but with extra steps. See
[TypeScript](/docs/guides/typescript).

## Running both during a migration

They share no state, so you can adopt tviem incrementally — keep TronWeb where
it works, and use tviem for new code paths. Point both at the same node and the
same keys; nothing coordinates between them, and nothing needs to.
