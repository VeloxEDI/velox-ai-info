---
title: TSoundexLength
description: "Supplies string Soundex's requested code length as an unrestricted script LongInt even though Delphi defines positive values only."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, soundex, length, longint, subrange]
---

```Delphi
TSoundexLength = LongInt
```

### Example

```Delphi
procedure EncodeName(const Name: String; var Code: String);
var
  CodeLength: TSoundexLength;
begin
  CodeLength := 4;
  Code := Soundex(Name, CodeLength);
end;
```

### Usage

`TSoundexLength` supplies string Soundex's requested code length as an unrestricted script LongInt even though Velox defines positive values only.

### Additional Technical Info
Delphi declares `TSoundexLength = 1..MaxInt`, but the Velox StrUtils importer registers it as `Integer`. The generated Code Library displays the canonical PascalScript name `LongInt`; both are the same signed 32-bit script type. Velox therefore does not enforce the native positive subrange when a variable is assigned or a function is called.

The type is accepted by [`Soundex`](../../Functions/Comparison/Soundex.md), [`SoundexSimilar`](../../Functions/Comparison/SoundexSimilar.md) and [`SoundexCompare`](../../Functions/Comparison/SoundexCompare.md). It controls the generated code length; it is not the source-text length, a similarity threshold or a confidence score.

#### Current implementation boundaries

Use a bounded value of at least two. Length four is the conventional choice. The current Delphi algorithm has an unusual length-one path: it begins with the source initial, checks the requested length only after appending a scored digit, and can therefore return more than one character. Zero and negative values also bypass the intended stopping condition and can return a nonstandard unpadded code.

A large positive value causes the routine to allocate zero padding up to that requested length. Because Velox exposes the full signed LongInt range, an untrusted or mistaken configuration can request gigabytes of text and exhaust process memory even when the source name is short. Apply a small application limit before calling; ordinary matching rarely needs more than a handful of characters.

The underlying Soundex algorithm is ASCII-focused, retains the first source character, performs no trim or Unicode normalization and intentionally produces collisions. Shorter lengths increase collisions. A valid length does not make a code suitable as identity proof or a language-neutral phonetic key.

The example is source-reviewed only; no Soundex function was executed.

**Related Code Library entries**

- [Soundex](../../Functions/Comparison/Soundex.md) - complete scoring, padding and invalid-length behavior.
- [SoundexSimilar](../../Functions/Comparison/SoundexSimilar.md) - exact equality of two generated codes.
- [SoundexCompare](../../Functions/Comparison/SoundexCompare.md) - lexical comparison of generated codes.
- [TSoundexIntLength](TSoundexIntLength.md) - bounded length for the packed-Integer family.

**External references**

- [Embarcadero TSoundexLength](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.TSoundexLength) - native Delphi `1..MaxInt` declaration.
- [Free Pascal TSoundexLength](https://www.freepascal.org/docs-html/rtl/strutils/tsoundexlength.html) - compatible positive subrange.
- [Free Pascal Soundex](https://www.freepascal.org/docs-html/rtl/strutils/soundex.html) - compatible function context; current Delphi source defines Velox's exact edge behavior.

<small>Created 2026-07-15</small>
