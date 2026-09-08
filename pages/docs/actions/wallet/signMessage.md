---
description: Sign a message.
title: signMessage
---

# signMessage

Signs a message with the account's key. Nothing touches the chain — this is for
proving control of an address off-chain.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signMessage({
  message: 'hello world',
})
```

## Raw bytes

Pass `{ raw }` to sign bytes rather than a UTF-8 string:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signMessage({
  message: { raw: '0xdeadbeef' }, // [!code focus]
})
```

## Returns

`Signature`

## Parameters

### message

- **Type:** `SignableMessage`

The message to sign — a UTF-8 string, or `{ raw }` carrying hex or bytes.

### account (optional)

- **Type:** `TronAccount | AccountKey`

The signing account. Falls back to the Client's hoisted account.

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const other = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
)

const signature = await walletClient.signMessage({
  account: other, // [!code focus]
  message: 'hello world',
})
```

:::warning
`0x…0002` is a placeholder. Never hard-code a real key — read it from an
environment variable or a secrets manager, or keep it out of your process with
[`toAccount`](/docs/accounts/toAccount).

Be equally careful with what you sign. A signature proves the key approved those
exact bytes, and it stays valid forever. Never sign a message you did not
construct yourself, and prefer
[`signTypedData`](/docs/actions/wallet/signTypedData) when a human has to
understand what they are approving.
:::

## Related

- [`signTypedData`](/docs/actions/wallet/signTypedData) — structured data, which
  a wallet can display meaningfully
- [`signTransaction`](/docs/actions/wallet/signTransaction) — signing a
  transaction instead
