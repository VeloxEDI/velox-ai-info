---
title: "SoundexSimilar"
description: "Reports whether two strings produce exactly equal Soundex codes at the requested length."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - similarity
---

```Delphi
Function SoundexSimilar( const AText, AOther : string; ALength : TSoundexLength) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SoundexSimilar('Robert', 'Rupert', 4);
end;
```

### Usage

`SoundexSimilar` reports whether two strings produce exactly equal Soundex codes at the requested length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | First text to encode. |
| `AOther` | `string`, `const` | Second text to encode. |
| `ALength` | `TSoundexLength` | Requested code length. Velox exposes this reference as `LongInt`; validate it before calling. |

**Returns**

`True` when `Soundex(AText, ALength) = Soundex(AOther, ALength)`; otherwise `False`.

**Behaviour**

The function is a grouping predicate. It answers whether the codes collide, not whether the source strings are identical, valid names or the same real-world entity.

**Errors**

Normal bounded inputs have no expected exception. Excessive length can raise an allocation/length error; invalid lengths can produce nonstandard codes without a validation exception.

**Usage notes**

Use this only as one candidate-matching signal. Confirm identity with authoritative fields and business rules. Use [`ResemblesText`](ResemblesText.md) only when the host-configurable procedure indirection is intended.

### Additional Technical Info
`SoundexSimilar` generates a Soundex code for each input at the requested length and returns exact code equality.

The example returns `True` because both codes are `R163`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.SoundexSimilar`. Current Delphi source calls `Soundex` twice and compares the managed result strings case-sensitively. Because normal generated codes are canonical uppercase/digit strings, no additional case fold is needed.

**Edge cases and quirks**

- Two empty strings return `True` because both codes are empty. One empty and one non-empty string return `False`.
- All [`Soundex`](Soundex.md) rules are inherited: ASCII-focused scoring, retained first character, no normalisation, invalid script lengths and the length-one bug.
- Shorter requested lengths increase collisions. Increasing length can distinguish more later consonant groups but does not make Soundex language-neutral or unique.
- Non-Latin or punctuation-heavy values can produce weak codes and misleading `True` results.
- A very large positive length can allocate large zero-padded codes twice before comparison.

**Side effects**

None. Two temporary result strings are allocated.

**Performance and concurrency**

Work is linear in both inputs up to code completion, plus comparison proportional to the generated code length. There is no shared mutable state.

**Related entries**

- [`Soundex`](Soundex.md) returns each code for inspection.
- [`SoundexCompare`](SoundexCompare.md) returns the code ordering.
- [`ResemblesText`](ResemblesText.md) normally uses four-character Soundex through a configurable procedure.

**External references**

- [Embarcadero `System.StrUtils.SoundexSimilar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.SoundexSimilar)
- [Free Pascal `SoundexSimilar`](https://www.freepascal.org/docs-html/rtl/strutils/soundexsimilar.html) - compatibility context; current Delphi `Soundex` source defines Velox's exact code equality.

<small>Created 2026-07-15</small>
