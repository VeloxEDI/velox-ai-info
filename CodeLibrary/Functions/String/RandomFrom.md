---
title: "RandomFrom"
description: "Returns one element selected by Delphi's process-wide pseudo-random generator from a non-empty string array."
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - random
  - array
---

```Delphi
Function RandomFrom( const AValues : TStringArray) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Choices: TStringArray;
begin
  SetArrayLength(Choices, 3);
  Choices[0] := 'Queued';
  Choices[1] := 'Ready';
  Choices[2] := 'Held';
  Value := RandomFrom(Choices);
end;
```

### Usage

`RandomFrom` returns one element selected by Velox's process-wide pseudo-random generator from a non-empty string array.

**Parameters**

| Parameter | Type | Meaning |
|---|---|---|
| `AValues` | `TStringArray` | Non-empty array of candidate strings. Duplicate values are separate positions and therefore increase that value's selection probability. |

**Return value**

The element at `Random(Length(AValues))`. The array is not modified.

**Important behavior and quirks**

- The array must contain at least one element. Empty input still computes index zero and then indexes an empty array; depending on runtime checking this can raise a range error or access invalid data. Treat it as invalid input.
- Empty strings are valid array elements and may be returned.
- Selection is by array position, not by distinct value.
- The result is not stable unless the generator seed and the complete sequence of all intervening random calls are controlled.
- Velox does not initialise or isolate a private generator for this call. Other code using Velox `Random`, `Randomize` or `RandSeed` affects the sequence.

**Security and concurrency**

The generator is predictable and unsuitable for passwords, tokens, identifiers, cryptographic keys, security decisions or unbiased regulated draws. Its shared seed is mutated without a per-call lock, so concurrent calls can race and make sequence reproduction unreliable.

### Additional Technical Info
`RandomFrom` returns one string from `AValues`. Every valid array position is selected through Delphi's standard pseudo-random number generator.

The example is fictional and source-reviewed only. Its output is intentionally nondeterministic.

**How it works**

The StrUtils implementation evaluates `AValues[Random(High(AValues) + 1)]`. In the installed Delphi runtime, `Random(Integer)` advances a global linear-congruential generator and scales its 32-bit output into the requested range.

**Errors and limits**

Apart from empty input, a very large array is limited by the script array and signed integer range. Returning an element copies or shares the managed string according to Delphi string semantics.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.RandomFrom`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StrUtils.RandomFrom)
- [Free Pascal: `StrUtils.RandomFrom`](https://www.freepascal.org/docs-html/rtl/strutils/randomfrom.html) - compatible intent; Velox uses Delphi's generator and implementation.

<small>Created 2026-07-15</small>
