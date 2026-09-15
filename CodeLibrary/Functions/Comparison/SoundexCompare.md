---
title: "SoundexCompare"
description: "Compares two generated Soundex codes lexically and returns Delphi's integer comparison result."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - ordering
---

```Delphi
Function SoundexCompare( const AText, AOther : string; ALength : TSoundexLength) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SoundexCompare('Robert', 'Rupert', 4);
end;
```

### Usage

`SoundexCompare` compares two generated Soundex codes lexically and returns Velox's integer comparison result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | First text to encode. |
| `AOther` | `string`, `const` | Second text to encode. |
| `ALength` | `TSoundexLength` | Requested code length. Velox exposes this reference type as `LongInt`, so validate it explicitly. |

**Returns**

A negative value when the first code sorts before the second, zero when the codes are equal, and a positive value when the first code sorts after the second. Current Windows locale comparison normally produces `-1`, `0` or `1`; use the sign rather than depending on magnitude.

**Behaviour**

Zero means equal Soundex codes, not equal source strings. Many distinct values intentionally collide. The result is antisymmetric for ordinary generated codes, and both empty inputs compare equal.

**Errors**

Normal bounded inputs have no expected exception. Excessive positive length can fail during Soundex padding; invalid values can produce nonstandard codes rather than a dedicated validation error.

**Usage notes**

Test the result against zero when the goal is phonetic grouping. Prefer [`SoundexSimilar`](SoundexSimilar.md) for an explicit Boolean and store the generated code when operators need to inspect why two values grouped together.

### Additional Technical Info
`SoundexCompare` generates a Soundex code for each input at the requested length, then compares the two codes as strings. It orders the codes; it does not measure how similar the original spellings are.

The example returns `0` because both codes are `R163`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.SoundexCompare`. Current source calls `Soundex(AText, ALength)` and `Soundex(AOther, ALength)`, then passes the two result strings to `System.SysUtils.AnsiCompareStr`. On Windows that terminal comparison uses `CompareString` with the user-default locale and no ignore-case flag.

Normal Soundex results contain an initial character followed by digits, so code generation is usually more significant than locale collation.

**Edge cases and quirks**

- All [`Soundex`](Soundex.md) behaviours are inherited, including ASCII-focused scoring, no normalisation, invalid script lengths and the requested-length-one bug.
- Empty versus non-empty compares the empty code against the generated code; both empty values return zero.
- A non-letter first character is retained in the code and participates in locale string ordering.
- The terminal is locale-aware `AnsiCompareStr`, not ordinal `CompareStr`. Ordering can therefore depend on the process account's user locale when codes contain unusual first characters.
- The integer result is an ordering indicator, not a phonetic distance or confidence score.

**Side effects**

None. Two temporary code strings are allocated.

**Performance and concurrency**

Work is linear in both source lengths up to code completion, plus the short code comparison. There is no mutable shared state, although the terminal comparison reads the user-default locale.

**Related entries**

- [`Soundex`](Soundex.md) defines code generation and its boundaries.
- [`SoundexSimilar`](SoundexSimilar.md) returns code equality directly.
- [`ResemblesText`](ResemblesText.md) uses the process-wide configurable resemblance procedure.

**External references**

- [Embarcadero `System.StrUtils.SoundexCompare`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.SoundexCompare)
- [Free Pascal `SoundexCompare`](https://www.freepascal.org/docs-html/rtl/strutils/soundexcompare.html) - compatibility context; current Delphi Soundex and locale comparison sources define Velox's exact result.

<small>Created 2026-07-15</small>
