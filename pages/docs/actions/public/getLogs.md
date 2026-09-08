---
description: Fetch and decode contract event logs.
title: getLogs
---

# getLogs

Fetches event logs from the event service, decoded against an ABI.

## Usage

Pass an event fragment and the logs come back decoded, with `args` typed from
the event's inputs:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
const logs = await publicClient.getLogs({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  event: trc20Abi[4],
})
```

Without an event, you get raw logs for the address:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const logs = await publicClient.getLogs({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## Returns

`Log[]`

## Parameters

### address (optional)

- **Type:** `` `T${string}` | readonly `T${string}`[] ``

Restrict to logs emitted by these contracts. Public nodes cap the list at 1000
entries.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const logs = await publicClient.getLogs({
  address: [
    'TTokenContractDemoxxxxxxxxxxxxxxxx',
    'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  ],
})
```

### event (optional)

- **Type:** `AbiEvent`

A single event fragment to filter on and decode against.

### args (optional)

- **Type:** `readonly unknown[] | Record<string, unknown>`

Indexed argument filter — positional over the event's indexed inputs, or keyed
by name. An array entry is an OR-list of alternatives; `null` or `undefined`
leaves that topic as a wildcard.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
<!--@include: ../../../../snippets/trc20Abi.ts-->
// ---cut---
// Transfers *to* one address, from anyone.
const logs = await publicClient.getLogs({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  event: trc20Abi[4],
  args: { to: 'TRecipientAccountDemoxxxxxxxxxxxxx' }, // [!code focus]
})
```

Only **indexed** inputs can be filtered — they are what becomes a topic. In the
TRC-20 `Transfer` event `from` and `to` are indexed; `value` is not, so it can
be read from a decoded log but not filtered on.

### strict (optional)

- **Type:** `boolean`
- **Default:** `false`

Drop logs that do not decode exactly against the event ABI, instead of returning
them partially decoded. Useful when several contracts share a topic signature
but differ in their non-indexed data.

### topics (optional)

- **Type:** `readonly string[]`

Raw topic filter, as an alternative to `event` + `args`. Mutually exclusive with
them.

## Related

- [`getTransactionInfo`](/docs/actions/public/getTransactionInfo) — logs from
  one transaction
- [`getContract`](/docs/contract/getContract) — `getEvents`, scoped to a bound
  contract
