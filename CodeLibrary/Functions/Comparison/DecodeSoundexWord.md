---
title: "DecodeSoundexWord"
description: "Decodes a Word produced by SoundexWord into its four-character Soundex code."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - decoding
---

```Delphi
Function DecodeSoundexWord( AValue : Word) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Encoded: Word;
begin
  Encoded := SoundexWord('Robert');
  Value := DecodeSoundexWord(Encoded);
end;
```

### Usage

`DecodeSoundexWord` decodes a Word produced by SoundexWord into its four-character Soundex code.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Word` | Unsigned 16-bit representation created by Velox `SoundexWord`. |

**Returns**

The decoded four-component Soundex string for a valid matching encoding.

**Behaviour**

Values produced by `SoundexWord` are intended to round-trip to its normalised four-character Soundex code. Multiple source words can yield the same result; the code is suitable for candidate matching, not identity proof.

**Errors**

There is no dedicated invalid-encoding exception. Out-of-contract Word values can return meaningless characters rather than failing, so validate provenance at the data boundary.

**Usage notes**

Use the Word form only when a compact four-character Soundex key is required. Store or log the decoded string as well when operational diagnosis needs a human-readable value.

### Additional Technical Info
`DecodeSoundexWord` reconstructs the four-character Soundex code stored in the `Word` returned by [`SoundexWord`](SoundexWord.md). The result is a phonetic code, not the original word.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.DecodeSoundexWord`. Current Delphi source recovers two trailing Soundex digits with base-7 remainder/division operations, recovers the preceding component in base 26, and maps the remaining quotient to the first letter from `A`.

Unlike the integer form, the Word representation carries no variable length and the decoder always constructs four components.

**Edge cases and quirks**

- The function accepts every `Word` value and performs no validity check. Type range alone does not prove the value came from `SoundexWord`.
- Arbitrary values can create a component outside the expected single Soundex digit or an initial character outside `A` through `Z`; string construction still proceeds.
- The decoder cannot recover the source word, case or punctuation removed by Soundex processing.
- The integer and Word encodings are different layouts. Do not decode a truncated or cast `SoundexInt` value with this function.
- This representation is coupled to the Delphi RTL algorithm. Treat persisted values as versioned implementation data rather than a universal Soundex interchange format.

**Side effects**

None. Only a result string is allocated.

**Performance and concurrency**

The decoder performs a fixed number of arithmetic and string operations. It is constant-time and uses no shared mutable state.

**Related entries**

- [`SoundexWord`](SoundexWord.md) creates the matching encoded value.
- [`DecodeSoundexInt`](DecodeSoundexInt.md) handles the variable-length integer representation and has different edge cases.
- [`SoundexInt`](SoundexInt.md) creates that variable-length representation.

**External references**

- [Embarcadero `System.StrUtils.DecodeSoundexWord`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.DecodeSoundexWord)
- [Free Pascal `DecodeSoundexWord`](https://www.freepascal.org/docs-html/rtl/strutils/decodesoundexword.html) — compatible API reference; the deployed Delphi RTL defines Velox's exact encoding.

<small>Created 2026-07-15</small>
