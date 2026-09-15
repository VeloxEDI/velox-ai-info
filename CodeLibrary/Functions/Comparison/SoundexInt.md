---
title: "SoundexInt"
description: "Encodes a Soundex code of up to eight characters into an Integer that also stores the requested length."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - integer
---

```Delphi
Function SoundexInt( const AText : string; ALength : TSoundexIntLength) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SoundexInt('Robert', 4);
end;
```

### Usage

`SoundexInt` encodes a Soundex code of up to eight characters into an Integer that also stores the requested length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | Text to encode. |
| `ALength` | `TSoundexIntLength` | Requested length from `1` through `8`. Validate externally supplied values before calling. |

**Returns**

Zero for empty input. For valid non-empty input, the packed integer containing the generated code and the length in its base-9 final component.

**Behaviour**

The integer is useful only with the matching Velox layout. It cannot recover the original word, and collisions from the Soundex code remain collisions in the integer.

**Errors**

Valid non-empty input at lengths three through eight has no expected exception. Excessive length can fail during padding or integer arithmetic; invalid first characters and out-of-range lengths can produce meaningless output rather than a dedicated error.

**Usage notes**

Prefer an `ALength` from three through eight when the integer must later be decoded. Treat the integer as an opaque value, not a globally portable phonetic identifier.

### Additional Technical Info
`SoundexInt` generates a Soundex code and packs its initial, digits and requested length into one signed 32-bit `Integer`. It is a Delphi-specific compact representation, not a standard Soundex interchange number.

The example returns `195772`, the packed form of `R163` at length four. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.SoundexInt`. Current Delphi source first calls `Soundex(AText, ALength)`, then:

1. converts the initial to a zero-based `A`-`Z` value;
2. for length greater than one, combines the first digit in base 26;
3. combines remaining digits in base 7; and
4. multiplies by 9 and adds `ALength`.

For `R163` at length four the sequence is `17 -> 443 -> 3107 -> 21752 -> 195772`.

**Edge cases and quirks**

- Empty input always returns zero. The approved [`DecodeSoundexInt`](DecodeSoundexInt.md) page documents that zero decodes as `A`, so empty input does not round-trip.
- Velox does not enforce Delphi's `1..8` subrange. Lengths outside it are out of contract.
- Lengths one and two are encoded, but the current Delphi decoder cannot faithfully reconstruct them: length one loses the initial and length two loses its digit. Use lengths three through eight when round-trip decoding is required.
- Length one also inherits `Soundex`'s length-one bug, although this packer only takes the initial when `ALength <= 1`.
- Length greater than eight can overflow signed 32-bit packing. The result can wrap or fail according to deployed overflow/range settings and must not be relied on.
- Zero/negative lengths produce nonstandard arithmetic because they bypass the normal digit loop and still store the supplied length component.
- A first character outside `A` through `Z` yields an out-of-range initial value and potentially negative, wrapped or nonportable output.
- Persisted values are coupled to this algorithm and integer width. Store a version/format contract or store the readable Soundex code instead.

**Side effects**

None. A temporary Soundex string is allocated.

**Performance and concurrency**

For the supported range, work is linear in the input until at most eight code characters are produced, followed by bounded packing. The function uses no shared mutable state.

**Related entries**

- [`DecodeSoundexInt`](DecodeSoundexInt.md) documents the matching decoder and its short-length defects.
- [`Soundex`](Soundex.md) defines the source code generation.
- [`SoundexWord`](SoundexWord.md) uses a fixed four-character `Word` layout.

**External references**

- [Embarcadero `System.StrUtils.SoundexInt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.SoundexInt)
- [Free Pascal `SoundexInt`](https://www.freepascal.org/docs-html/rtl/strutils/soundexint.html) - compatible layout context; current Delphi source and the Velox type import define exact range and overflow behaviour.

<small>Created 2026-07-15</small>
