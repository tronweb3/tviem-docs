---
description: The HTTP Transport for TRON's HTTP API.
title: HTTP Transport
---

# HTTP Transport

The `http` Transport executes requests against TRON's HTTP API.

## Import

```ts twoslash
import { http } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io'), // [!code focus]
})
```

Called with no URL, the transport uses the endpoints from the
[Chain](/docs/chains/intro) you passed:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(), // [!code focus]
})
```

## Parameters

### url (optional)

- **Type:** `string`
- **Default:** the Chain's FullNode URL

The FullNode base URL.

### apiKey (optional)

- **Type:** `string`

An API key, sent as TronGrid's `TRON-PRO-API-KEY` header. Public endpoints work
without one, at a much lower rate limit.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    apiKey: process.env.TRONGRID_API_KEY, // [!code focus]
  }),
})
```

### solidityUrl (optional)

- **Type:** `string`
- **Default:** the Chain's SolidityNode URL

Base URL for solidified reads — every call made with `confirmed: true`. Set it
when your FullNode and SolidityNode live on different hosts.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('http://127.0.0.1:8090', {
    solidityUrl: 'http://127.0.0.1:8091', // [!code focus]
  }),
})
```

### eventUrl (optional)

- **Type:** `string`
- **Default:** the Chain's event URL

Base URL for the event/log endpoints used by
[`getLogs`](/docs/actions/public/getLogs).

### timeout (optional)

- **Type:** `number`
- **Default:** `10_000`

Timeout in milliseconds for a request.

### retryCount (optional)

- **Type:** `number`
- **Default:** `3`

How many times to retry a failed request.

### retryDelay (optional)

- **Type:** `number`
- **Default:** `150`

Base delay in milliseconds between retries. Retries back off exponentially from
this value.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    retryCount: 5, // [!code focus:2]
    retryDelay: 200,
  }),
})
```

### fetchFn (optional)

- **Type:** `typeof fetch`
- **Default:** the platform `fetch`

A custom `fetch` implementation. Use it to route requests through a proxy, add
instrumentation, or supply a polyfill on an older runtime.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    fetchFn: async (input, init) => { // [!code focus:4]
      console.log('→', input)
      return fetch(input, init)
    },
  }),
})
```

### fetchOptions (optional)

- **Type:** `Omit<RequestInit, 'body' | 'method' | 'signal'>`

Extra options merged into every request — headers, credentials, cache mode.
`body`, `method` and `signal` are owned by the transport and cannot be set here.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://api.trongrid.io', {
    fetchOptions: { // [!code focus:3]
      headers: { 'X-Trace-Id': 'abc123' },
    },
  }),
})
```

### raw (optional)

- **Type:** `boolean`
- **Default:** `false`

Return the node's response body untouched, skipping tviem's normalization. An
escape hatch for endpoints tviem does not model yet.

### key (optional)

- **Type:** `string`
- **Default:** `"http"`

### name (optional)

- **Type:** `string`
- **Default:** `"HTTP JSON-RPC"`
