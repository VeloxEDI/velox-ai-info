---
title: "SoundexWord"
description: "Encodes a four-character Soundex code into a Word."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - word
---

```Delphi
Function SoundexWord( const AText : string) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SoundexWord('Robert');
end;
```

### Usage

`SoundexWord` encodes a four-character Soundex code into a Word.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | Non-empty text to encode. |

**Returns**

The packed four-character code. For a normal initial `A` through `Z`, valid output fits within `Word` and can be reconstructed with [`DecodeSoundexWord`](DecodeSoundexWord.md).

**Behaviour**

All words with the same four-character Soundex code produce the same packed value. The result cannot recover the source spelling.

**Errors**

Normal non-empty input beginning with an ASCII letter has no expected exception. Empty or invalid-initial input can cause memory/range/conversion behaviour dependent on the deployed RTL checks and must be rejected by the caller.

### Additional Technical Info
`SoundexWord` generates a four-character Soundex code and packs the initial and three digits into an unsigned 16-bit `Word`. It is a compact Delphi representation, not a standard phonetic interchange number.

The example returns `21752`, the packed form of `R163`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.SoundexWord`. The routine calls `Soundex(AText, 4)`, then packs:

```text
value = ordinal(initial) - ordinal('A')
value = value * 26 + first digit
value = value * 7  + second digit
value = value * 7  + third digit
```

For `R163`, this is `17 -> 443 -> 3107 -> 21752`.

**Edge cases and quirks**

- Empty input is unsafe. `Soundex('', 4)` returns an empty string, after which `SoundexWord` indexes characters 0 through 3 without an empty check. This is out-of-range access: it can raise when range checking applies or otherwise produce invalid, memory-dependent behaviour. It never defines an empty-input sentinel. Validate non-empty input first.
- The first character is assumed to be `A` through `Z`. Punctuation, digits and non-Latin initials can create negative/out-of-range intermediate values and wrapped or range-dependent `Word` results.
- The remaining Soundex limitations are inherited: ASCII-focused scoring, no Unicode normalisation and expected phonetic collisions.
- The packed layout is Delphi-specific. Do not assume another Soundex implementation uses the same bases or first-character mapping.
- Unlike `SoundexInt`, no length is stored because the code is always four characters.

**Side effects**

None. A temporary four-character code is allocated.

**Performance and concurrency**

The scan stops once four code characters are available or input ends, then performs constant-time packing. There is no shared mutable state.

**Remarks**

Require non-empty, suitably normalised name text before calling. Store the readable code when interoperability and diagnosis matter more than two-byte compactness.

**Related entries**

- [`DecodeSoundexWord`](DecodeSoundexWord.md) reverses the matching packed layout.
- [`Soundex`](Soundex.md) returns the readable four-character source code.
- [`SoundexInt`](SoundexInt.md) supports a caller-supplied encoded length.

**External references**

- [Embarcadero `System.StrUtils.SoundexWord`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.SoundexWord)
- [Free Pascal `SoundexWord`](https://www.freepascal.org/docs-html/rtl/strutils/soundexword.html) - compatible layout context; current Delphi source defines Velox's empty-input and packing behaviour.

<small>Created 2026-07-15</small>
