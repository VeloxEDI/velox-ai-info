---
title: "Randomize"
description: "Reseeds Velox's shared pseudo-random generator from current Windows timing."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - random
  - seed
---

```Delphi
procedure Randomize;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Randomize;
  Value := Random;
end;
```

### Usage

`Randomize` reseeds Velox's shared pseudo-random generator from current Windows timing. The new state affects subsequent `Random` and `RandomInt` calls throughout the same Designer, Service or API Service process.

### Additional Technical Info
`vxCommonNumber.Randomize` now calls `System.Randomize` directly. It no longer assigns `GetTickCount` to `RandSeed` first, removing the range-check failure that could occur during the upper half of the 32-bit tick-count cycle.

Call it only when that shared reseed is intended. Repeated row/event calls can degrade predictability and couple otherwise unrelated flows. The example is fictional and source-reviewed only.

**Implementation**

1. `vxCommonNumber.Randomize` calls `System.Randomize`.
2. On Windows, `System.Randomize` obtains a high-resolution `QueryPerformanceCounter` value and falls back to `GetTickCount` if necessary.
3. It combines one generated value with that counter.
4. `DefaultRandomize` XORs the high and low 32-bit halves and replaces `RandSeed`.

**State and concurrency**

- The mutation is process-global and unprotected. Concurrent random calls/reseeds can interleave.
- Calling from one action changes sequences observed by all other actions in the same Designer/Service/API Service process.
- There is no per-flow generator instance, lock, audit record or previous-seed return.
- The Windows fallback tick count wraps approximately every 49.7 days, but the normal high-resolution counter and generated-state mix add other variation.
- Timing-based seeding does not make the underlying 32-bit linear-congruential generator cryptographically secure.

**Errors and platform assumptions**

The reviewed product uses the Windows implementation. Performance-counter failure is handled by `System.Randomize` using its tick-count fallback. Velox does not catch or separately log this call.

**Related entries**

- [`Random`](Random.md) consumes the shared state.
- [`RandomInt`](RandomInt.md) consumes the same state with biased rounding.
- [`RandomizeSeed`](RandomizeSeed.md) directly sets a repeatable signed 32-bit seed, subject to shared-state interference.

**External references**

- [Free Pascal: `System.Randomize`](https://www.freepascal.org/docs-html/rtl/system/randomize.html)
- [Embarcadero DocWiki: `System.Randomize`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Randomize)
- [Embarcadero DocWiki: `System.RandSeed`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.RandSeed)

<small>Created 2026-07-15</small>
