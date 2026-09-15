---
title: TSoundexIntLength
description: "Supplies SoundexInt's requested packed-code length as an unrestricted script LongInt even though Delphi defines the range as 1 through 8."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, soundex, integer, length, subrange]
---

```Delphi
TSoundexIntLength = LongInt
```

### Example

```Delphi
procedure EncodeName(const Name: String; var Code: Integer);
var
  CodeLength: TSoundexIntLength;
begin
  CodeLength := 4;
  Code := SoundexInt(Name, CodeLength);
end;
```

### Usage

`TSoundexIntLength` supplies SoundexInt's requested packed-code length as an unrestricted script LongInt even though Velox defines the range as 1 through 8.

#### Valid and practical ranges

The intended Velox range is `1..8`. The upper bound exists because the generated characters and requested length are packed into one signed 32-bit Integer. Values above eight can overflow the packing algorithm; zero and negative values take nonstandard branches and still participate in the stored length arithmetic.

The current Velox decoder also has short-length defects: values encoded with length one lose the initial during decode, and values encoded with length two lose their digit. If [`DecodeSoundexInt`](../../Functions/Comparison/DecodeSoundexInt.md) round-trip behavior matters, use `3..8`; otherwise `1..8` is still the declared Velox input range, subject to [`Soundex`](../../Functions/Comparison/Soundex.md)'s length-one generation quirk.

Length four is conventional and produces a compact Velox-specific code. The integer is not a portable standard identifier and cannot recover the original text. Store the length/algorithm contract with persisted values, or store the readable Soundex string when interoperability matters.

### Additional Technical Info
Delphi declares `TSoundexIntLength = 1..8`, but the Velox StrUtils importer registers it as `Integer`. The generated Code Library displays PascalScript's canonical name `LongInt`; both are the same signed 32-bit script type. The native subrange is therefore documentation, not a compiler-enforced constraint in Velox scripts.

This type is used by [`SoundexInt`](../../Functions/Comparison/SoundexInt.md). Assigning a value to a `TSoundexIntLength` variable performs no range check specific to Soundex. Validate the value before the call whenever it comes from configuration, data, a Variant or arithmetic.

**Related Code Library entries**

- [SoundexInt](../../Functions/Comparison/SoundexInt.md) - exact packing algorithm, errors and overflow behavior.
- [DecodeSoundexInt](../../Functions/Comparison/DecodeSoundexInt.md) - matching decoder and short-length limitations.
- [TSoundexLength](TSoundexLength.md) - length used by the string-code family.

**External references**

- [Embarcadero TSoundexIntLength](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.StrUtils.TSoundexIntLength) - native Delphi `1..8` declaration.
- [Free Pascal TSoundexIntLength](https://www.freepascal.org/docs-html/rtl/strutils/tsoundexintlength.html) - compatible `1..8` type.
- [Free Pascal SoundexInt](https://www.freepascal.org/docs-html/rtl/strutils/soundexint.html) - compatible function context; Velox executes the traced Delphi implementation.

<small>Created 2026-07-15</small>
