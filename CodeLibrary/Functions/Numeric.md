---
title: "Numeric"
description: "Functions for bounds, mutation, rounding, pseudo-random values and specialised numeric or colour conversion."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - random
  - bounds
---

The Numeric group covers several distinct implementation families: compiler-injected integer operations, array/type bounds, Velox-specific parsing and mapping helpers, extrema, rounding algorithms and Delphi's process-global pseudo-random generator. Similar numeric return types do not make these entries interchangeable.

## Choosing an entry

- Use [`Inc`](Numeric/Inc.md), [`Dec`](Numeric/Dec.md) or [`GetAndInc`](Numeric/GetAndInc.md) only when caller-visible mutation is intended.
- Use [`Low`](Numeric/Low.md) and [`High`](Numeric/High.md) for supported array/string/type bounds; their required argument is omitted from the generated declaration and supplied by compiler injection.
- Use [`MinIntValue`](Numeric/MinIntValue.md) and [`MaxIntValue`](Numeric/MaxIntValue.md) for non-empty integer arrays.
- Compare [`Round`](Numeric/Round.md), [`Round2`](Numeric/Round2.md), [`Round2BR`](Numeric/Round2BR.md), [`Round2Up`](Numeric/Round2Up.md) and [`RoundAs`](Numeric/RoundAs.md) before selecting a rounding policy. They deliberately implement different midpoint, scaling, text and fallback rules.
- Treat `Random...` entries as simulation/convenience tools, never as cryptographic or security randomness.

## Width, conversion and locale

Several results are 32-bit `LongInt`/`Integer` even when the input is `Extended` or Variant. Overflow, range checks, active floating-point rounding mode and Variant conversion occur before or during narrowing. `ExtractNumber` filters characters and then parses with system-locale rules; it is not a general invariant numeric parser. `LetterToDecimalNumber` and the HTML colour converter also have deliberately narrow input conventions.

Binary floating-point cannot represent every decimal fraction. Define required decimal places and midpoint behavior in the mapping specification instead of assuming that a friendly function name means ordinary financial rounding.

## Pseudo-random global state

[`Random`](Numeric/Random.md), [`RandomInt`](Numeric/RandomInt.md), [`Randomize`](Numeric/Randomize.md) and [`RandomizeSeed`](Numeric/RandomizeSeed.md) use shared Delphi generator state. Concurrent calls can interleave and sequences are predictable. `RandomizeSeed` establishes a repeatable signed 32-bit seed only when no other process-wide random call intervenes. `RandomInt` uses a biased rounded mapping rather than a uniform integer selection.

Never use these entries for tokens, passwords, GUID replacements, nonces, security sampling or adversarial fairness.

## Mutation and concurrency

Compiler-injected `var` operations require writable compatible storage. Mutation of a global or otherwise shared value is not atomic. Keep counters execution-local or coordinate them through a database/service mechanism designed for concurrency.
