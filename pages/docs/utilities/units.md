---
description: Convert between TRX and SUN.
title: Unit Utilities
---

# Unit Utilities

TRX has 6 decimals. On chain everything is quoted in **SUN**, the smallest unit:

```
1 TRX = 1,000,000 SUN
```

Every amount in and out of tviem is a `bigint` in SUN. These helpers convert at
the boundary with your UI.

## formatTrx

SUN to a decimal string.

```ts twoslash
import { formatTrx } from '@tronweb3/tviem'

const trx = formatTrx(1_500_000n)
//    ^?
```

`formatTrx(1_500_000n)` is `'1.5'`. The result is a **string**, not a number —
converting to `number` is what reintroduces the precision loss `bigint` avoided.

Typical use, at the display boundary:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
import { formatTrx } from '@tronweb3/tviem'

const balance = await publicClient.getBalance({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

const display = `${formatTrx(balance)} TRX`
```

## parseTrx

A decimal string to SUN.

```ts twoslash
import { parseTrx } from '@tronweb3/tviem'

const sun = parseTrx('1.5')
//    ^?
```

Takes a **string**, deliberately — passing a float would already have lost
precision before tviem saw it.

```ts twoslash
import { parseTrx } from '@tronweb3/tviem'
// ---cut---
// ✅ exact
parseTrx('0.000001')

// ❌ 0.1 + 0.2 is not 0.3 in binary floating point
parseTrx(String(0.1 + 0.2))
```

Invalid input throws `InvalidDecimalNumberError`.

## formatUnits

The general form, for any decimal precision — TRC-20 tokens usually declare
their own.

```ts twoslash
import { formatUnits } from '@tronweb3/tviem'

// A token with 18 decimals.
const display = formatUnits(1_000_000_000_000_000_000n, 18)
//    ^?
```

Read the precision from the contract rather than assuming it:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { formatUnits } from '@tronweb3/tviem'

const address = 'TTokenContractDemoxxxxxxxxxxxxxxxx'

const [balance, decimals] = await Promise.all([
  publicClient.readContract({
    address,
    account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
    abi: trc20Abi,
    functionName: 'balanceOf',
    args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
  }),
  publicClient.readContract({
    address,
    account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
    abi: trc20Abi,
    functionName: 'decimals',
  }),
])

const display = formatUnits(balance, Number(decimals)) // [!code focus]
```

:::info
Note the `Number(decimals)`. tviem decodes **every** unsigned integer as
`bigint`, including narrow ones like `uint8` — unlike abitype's default, which
maps `uint8` through `uint48` to `number`. So a contract's `decimals()` comes
back as `bigint`, while `formatUnits` wants a `number` for its precision
argument. The compiler catches the mismatch; this is the conversion it is asking
for.
:::

## parseUnits

A decimal string to the smallest unit, at any precision.

```ts twoslash
import { parseUnits } from '@tronweb3/tviem'

const value = parseUnits('1.5', 18)
//    ^?
```

## trxUnits

The unit table TRX conversions are built on.

```ts twoslash
import { trxUnits } from '@tronweb3/tviem'

trxUnits.sun
//       ^?
```

`formatTrx(value)` is `formatUnits(value, trxUnits.sun)`, and `parseTrx` is the
inverse.

## Arithmetic

Do the maths in SUN, format once at the end. Mixing formatted strings back into
arithmetic is where rounding errors come from.

```ts twoslash
import { formatTrx, parseTrx } from '@tronweb3/tviem'
// ---cut---
const price = parseTrx('12.5')
const quantity = 3n

// ✅ exact throughout
const total = price * quantity

const display = formatTrx(total)
```

`bigint` division truncates, so scale before dividing when you need a fraction:

```ts twoslash
import { parseTrx } from '@tronweb3/tviem'
// ---cut---
const amount = parseTrx('100')

// 2.5% fee, computed without leaving integer arithmetic.
const fee = (amount * 25n) / 1000n
```
