---
title: "Soundex"
description: "Creates a variable-length Delphi Soundex code from text using the requested code length."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - encoding
---

```Delphi
Function Soundex( const AText : string; ALength : TSoundexLength) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Soundex('Robert', 4);
end;
```

### Usage

Creates a variable-length Velox Soundex code from text using the requested code length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | Text to encode. It is not trimmed or normalised. |
| `ALength` | `TSoundexLength` | Requested code length. Velox defines `TSoundexLength` as `1..MaxInt`, but Velox exposes it as a `LongInt` reference without that subrange enforcement. |

**Returns**

An empty string for empty input. For normal non-empty input and a requested length of at least two, a code of exactly `ALength` characters: the first input character followed by digits `1` through `6` and zero padding.

**Behaviour**

For example, consonants with the same score are collapsed while adjacent, vowels can separate repeated scores, and `H`/`W` do not. Soundex codes are intentionally lossy; many distinct strings share a code.

**Errors**

Normal bounded input has no expected exception. Excessive positive length can raise an allocation/length error. Out-of-contract lengths can produce nonstandard results rather than a dedicated validation error.

**Usage notes**

Use an explicit length from 2 upward in Velox; length four is the conventional default and the fixed size used by [`SoundexWord`](SoundexWord.md). Treat a code as a candidate-grouping aid, not identity evidence.

### Additional Technical Info
`Soundex` converts text into Delphi's variable-length Soundex representation. The code keeps an uppercased first character and represents later ASCII consonant groups with digits.

The example returns `R163`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.Soundex`. Current Delphi source:

1. returns empty for empty input;
2. uppercases and copies the first character to the result;
3. scores subsequent ASCII letters into six consonant groups;
4. appends a positive score when it differs from the previous effective score;
5. stops when the result length reaches `ALength`; and
6. pads a short result with zeroes.

Vowels and most non-scored characters have score zero and reset duplicate suppression. `H` and `W` have score `-1`: they emit nothing and do not reset the previous score. Case is included in the table, so later characters need no case-conversion pass.

**Edge cases and quirks**

- The generated PascalScript type is `LongInt`, so scripts can pass values outside Delphi's nominal `1..MaxInt` subrange.
- Requested length `1` has a current algorithm quirk. The length check occurs only after a digit is appended; once the result grows from one to two characters it can never equal one. Text containing scored later consonants can therefore return a code longer than one instead of just the initial.
- Zero or negative length similarly does not cap the scan and can return the initial plus all emitted digits.
- A very large positive length requests a correspondingly large zero-padding allocation and can exhaust memory.
- Only following characters in the ASCII `A`-`Z`/`a`-`z` table receive phonetic scores. Non-Latin letters and most punctuation score zero.
- The first character is retained even when it is punctuation, a digit or a non-Latin character; the function does not validate it as `A` through `Z`.
- Input is not Unicode-normalised, trimmed or transliterated. Empty versus whitespace-only text therefore behaves differently.
- A one-character input with an ordinary length is padded with zeroes, for example `A000` at length four.

**Side effects**

None. The function allocates only the result and temporary padding.

**Performance and concurrency**

Scanning is linear until the requested length is reached or input ends. Padding is proportional to the requested length. The function uses no shared mutable state and is re-entrant.

**Related entries**

- [`SoundexSimilar`](SoundexSimilar.md) compares two generated codes.
- [`SoundexCompare`](SoundexCompare.md) returns their lexical relationship.
- [`SoundexInt`](SoundexInt.md) packs a code and its length into an `Integer`.
- [`SoundexWord`](SoundexWord.md) packs the fixed four-character code into a `Word`.

**External references**

- [Embarcadero `System.StrUtils.Soundex`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.StrUtils.Soundex) - the current Athens route does not render reliably, and this direct English symbol page documents the same declaration.
- [Free Pascal `Soundex`](https://www.freepascal.org/docs-html/rtl/strutils/soundex.html) - compatibility context; current Delphi source defines Velox's scoring and invalid-length quirks.

<small>Created 2026-07-15</small>
