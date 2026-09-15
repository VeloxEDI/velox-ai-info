---
title: "RandomizeSeed"
description: "Sets Velox's shared pseudo-random generator to a supplied signed 32-bit seed."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - random
  - seed
  - deterministic
---

```Delphi
procedure RandomizeSeed(aSeed: Integer);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  RandomizeSeed(12345);
  Value := Random; // repeatable when no other shared random call intervenes
end;
```

### Usage

`RandomizeSeed` sets Velox's shared pseudo-random generator to the supplied signed 32-bit seed. Reusing a seed produces the same sequence only when no other random call or reseed in the process intervenes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSeed` | `Integer` | Signed 32-bit seed from `-2147483648` through `2147483647`. `Integer` has the same width in Velox Win32 and Win64 builds. |

**Selection guidance**

Use this procedure only when a process-global deterministic sequence is acceptable. It is not an isolated per-Flow generator, so concurrent Flows or other scripts can consume or replace the state.

### Additional Technical Info
`RandomizeSeed` directly assigns the supplied `Integer` to Delphi's global `RandSeed`. It no longer calls `System.Randomize`, so the supplied value remains the generator state until another random call advances it or another call reseeds it. The example is fictional and source-reviewed only.

**Implementation**

```Delphi
System.RandSeed := aSeed;
```

**Consequences**

- Repeating `RandomizeSeed(12345)` produces the same following sequence when the same random calls occur in the same order.
- Shared or concurrent calls can advance or replace the state between two calls in a Flow.
- No resulting or previous seed is returned.
- The state is process-global and affects unrelated flows/scripts in that process.
- The parameter and `RandSeed` are both `Integer`, which remains signed 32-bit in Win32 and Win64. Do not substitute `NativeInt`, whose width changes by platform.
- A deterministic 32-bit linear-congruential generator is not cryptographically secure.

**Related entries**

- [`Randomize`](Randomize.md) replaces the state using current timing.
- [`Random`](Random.md) consumes the resulting global state.
- [`RandomInt`](RandomInt.md) consumes the same state and adds distribution bias.

**External references**

- [Embarcadero DocWiki: `System.RandSeed`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.RandSeed)
- [Embarcadero DocWiki: `System.Randomize`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Randomize)
- [Free Pascal: `System.Randomize`](https://www.freepascal.org/docs-html/rtl/system/randomize.html)

<small>Created 2026-07-15</small>
