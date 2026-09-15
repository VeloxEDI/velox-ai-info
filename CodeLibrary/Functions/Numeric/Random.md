---
title: "Random"
description: "Advances Delphi's process-global linear-congruential generator and returns an Extended value in [0,1)."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - random
  - state
---

```Delphi
function Random: Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Random; // pseudo-random Extended from 0 inclusive to 1 exclusive
end;
```

### Usage

`Random` advances Velox's shared across the Velox process linear-congruential generator and returns an Extended value in [0,1).

**Parameters**

`Random` has no parameters. It can be called without parentheses.

**Returns**

One of 2^32 possible values formed as the next unsigned 32-bit generator output multiplied by `2^-32`. Zero is possible; one is not.

### Additional Technical Info
`Random` returns the next pseudo-random floating-point value from Delphi's process-global generator. The result is greater than or equal to zero and strictly less than one.

This generator is deterministic, shared and non-cryptographic. It is suitable for low-risk sampling/test variation where sequence coupling is acceptable, not for passwords, tokens, identifiers, security decisions or independent concurrent simulations. The example is fictional and source-reviewed only.

**Implementation**

1. `uPSI_vxCommonNumber` registers `vxCommonNumber.Random` directly.
2. The wrapper calls no-argument Delphi `System.Random`.
3. Installed `DefaultRandom32` advances global `RandSeed` with the linear-congruential recurrence `seed := seed * $08088405 + 1` modulo 2^32.
4. Delphi converts the unsigned output to floating point and multiplies it by `2^-32`.

`Random32Proc` can theoretically be replaced by host code, but Velox does not replace it in the reviewed source; the installed default above is the effective implementation.

**State, sequence and concurrency**

- Every call advances the same process-global `RandSeed`. [`Randomize`](Randomize.md) replaces that state using timing, while [`RandomizeSeed`](RandomizeSeed.md) assigns an explicit state.
- Other scripts/flows in the same Designer, Service or API Service process can change the sequence between two calls.
- The update is not protected by a lock. Concurrent calls can race and sequence behavior should not be treated as reproducible or independently partitioned.
- A process restart begins from RTL initialization state until a reseed occurs.
- The algorithm and 32-bit internal state are unsuitable for cryptographic unpredictability.

**Precision and target behaviour**

The public return type is `Extended`, but the scale constant is a `Double` and the entropy is only 32 bits. Win64 aliases `Extended` to `Double`; Win32 may carry the scaled value in wider precision, but that does not create more random states.

**Side effects**

The only direct side effect is mutation of process-global pseudo-random state. There is no log, database write or operating-system entropy read per call.

**Related entries**

- [`RandomInt`](RandomInt.md) maps this value to an inclusive rounded Integer range with a biased distribution.
- [`Randomize`](Randomize.md) timing-seeds the shared generator.
- [`RandomizeSeed`](RandomizeSeed.md) establishes a repeatable sequence only when no other shared random call intervenes.

**External references**

- [Free Pascal: `System.Random`](https://www.freepascal.org/docs-html/rtl/system/random.html)
- [Embarcadero DocWiki: `System.Random`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Random)

<small>Created 2026-07-15</small>
