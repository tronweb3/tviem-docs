---
description: Building a dApp with tviem, end to end.
title: Building a dApp
---

# Building a dApp

The read-heavy path: show balances and token data, let a user sign with their
own wallet, confirm what happened.

## Shape of the app

Most dApps want two clients with different lifetimes:

- One **Public Client**, created once and shared. It holds no key and is safe to
  put in a module scope.
- One **Wallet Client** per connected user, created when they connect.

```ts twoslash
// @filename: client.ts
// ---cut---
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    apiKey: process.env.TRONGRID_API_KEY,
  }),
})
```

Use an API key from the start. Public endpoints rate-limit hard enough to look
like a bug.

## Connecting a wallet

The user's key lives in their wallet, not your process, so build the account
from signing functions with [`toAccount`](/docs/accounts/toAccount):

```ts twoslash
// @noErrors
import { createWalletClient, http, toAccount } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

declare const injected: {
  address: `T${string}`
  signTransaction: (tx: unknown) => any
  signMessage: (message: unknown) => any
  signTypedData: (data: unknown) => any
}
// ---cut---
const account = toAccount({
  address: injected.address,
  signTransaction: (transaction) => injected.signTransaction(transaction),
  signMessage: ({ message }) => injected.signMessage(message),
  signTypedData: (data) => injected.signTypedData(data),
})

const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})
```

If the wallet signs asynchronously — most do — see
[the async note](/docs/accounts/toAccount#signing-stays-synchronous) for the
build-sign-broadcast split that handles it.

## Reading balances

TRX and a token, together:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { formatTrx, formatUnits } from '@tronweb3/tviem'

const user = 'TSenderAccountDemoxxxxxxxxxxxxxxxx'
const usdt = 'TTokenContractDemoxxxxxxxxxxxxxxxx'

const [trx, tokenBalance, decimals, symbol] = await Promise.all([
  publicClient.getBalance({ address: user }),
  publicClient.readContract({
    address: usdt,
    abi: trc20Abi,
    functionName: 'balanceOf',
    args: [user],
  }),
  publicClient.readContract({ address: usdt, abi: trc20Abi, functionName: 'decimals' }),
  publicClient.readContract({ address: usdt, abi: trc20Abi, functionName: 'symbol' }),
])

const display = {
  trx: `${formatTrx(trx)} TRX`,
  token: `${formatUnits(tokenBalance, Number(decimals))} ${symbol}`,
}
```

Batch independent reads with `Promise.all` — each one is a separate HTTP
request, and doing them in sequence is the easiest performance mistake to make.

## Binding a contract

If you touch the same contract repeatedly,
[`getContract`](/docs/contract/getContract) removes the repetition:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { getContract } from '@tronweb3/tviem'

const usdt = getContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  client: publicClient,
})

const symbol = await usdt.read.symbol()
const balance = await usdt.read.balanceOf(['TSenderAccountDemoxxxxxxxxxxxxxxxx'])
```

## Sending a transaction

Estimate, cap, send, confirm:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { getEnergyFee } from '@tronweb3/tviem'

const call = {
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
} as const

// 1. Size the fee cap.
const energy = await publicClient.estimateEnergy({ account, ...call })
const energyFee = getEnergyFee(await publicClient.getChainParameters())

// 2. Send.
const { txID } = await walletClient.writeContract({
  ...call,
  feeLimit: (energy * energyFee * 120n) / 100n,
})

// 3. Show the user something while it lands.
const receipt = await publicClient.waitForTransactionReceipt({
  hash: txID,
  confirmed: false,
})

if (receipt.status === 'reverted') throw new Error('transfer reverted')
```

`confirmed: false` returns as soon as the transaction is packed — a few seconds
rather than the minute or so full solidification takes. That is the right
trade-off for a UI spinner. For anything you cannot undo, wait for the default
`confirmed: true`.

## Validating user input

Addresses come out of a form as `string`. `isAddress` is the guard that makes
them usable:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
import { isAddress } from '@tronweb3/tviem'

declare const input: string

if (!isAddress(input)) throw new Error('Not a valid TRON address')

const balance = await publicClient.getBalance({ address: input })
```

The default checksum verification catches a mistyped character before it becomes
an irreversible transfer to nowhere.

Amounts are the same story — parse the string, never the float:

```ts twoslash
import { parseTrx } from '@tronweb3/tviem'
// ---cut---
declare const amountInput: string

// ✅
const amount = parseTrx(amountInput)
```

## Testing against Nile

Nile is the testnet most TRON tooling targets. Switch chains and nothing else
changes:

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { nile } from '@tronweb3/tviem/chains' // [!code focus]

const publicClient = createPublicClient({
  chain: nile, // [!code focus]
  transport: http(),
})
```

## Checklist

- One shared Public Client, a Wallet Client per user
- An API key on the transport
- `Promise.all` for independent reads
- `feeLimit` sized from an estimate, with headroom
- `receipt.status` checked — a resolved promise is not success
- `isAddress` on every address that came from a human
- `parseTrx` on every amount that came from a human
