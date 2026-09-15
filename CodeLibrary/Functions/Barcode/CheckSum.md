---
title: "CheckSum"
description: "Calculates a decimal GS1-style check digit using right-to-left 3 and 1 weighting."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - barcode
  - check-digit
  - modulo-10
---

```Delphi
Function CheckSum( const aData : string) : integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := CheckSum('941234554321'); // 9
end;
```

### Usage

`CheckSum` calculates a decimal GS1-style check digit using right-to-left 3 and 1 weighting.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Source characters excluding the check digit. Each character is converted independently; supply decimal digits without spaces or punctuation. |

**Returns**

An integer from `0` through `9`. An empty input returns `0`. A result of `0` means the weighted sum is already a multiple of ten.

**Behaviour**

The function calculates only from the supplied sequence. It does not identify or remove an existing check digit, validate a GS1 key length, or determine which application identifier owns the data.

**Errors**

An `EConvertError` from `StrToInt` propagates unchanged. If Velox overflow checking is enabled, an overflowing total can raise an arithmetic exception; otherwise normal build-specific integer overflow behaviour applies. No failure is logged or swallowed here.

**Usage notes**

The GS1 check digit is different from the modulo-103 symbol check character used by Code 128. ReportBuilder handles its Code 128 symbol calculation separately.

### Additional Technical Info
`CheckSum` calculates the standard decimal modulo-10 check digit for a digit string that does not yet contain its check digit. It weights the rightmost source digit by `3`, the next by `1`, and continues alternating towards the left.

**Implementation**

Velox registers the function directly in its common scripting import. The implementation makes two right-to-left passes over the Delphi string. The first starts at `Length(aData)`, steps back by two and totals those digits; the second starts at `Length(aData) - 1`, steps back by two and totals the intervening digits. Each character is extracted with the one-based `System.Copy(aData, index, 1)` overload and converted by `SysUtils.StrToInt`.

The first total is multiplied by `3`, the second is added, and the result is reduced modulo ten. A non-zero remainder is subtracted from ten; a zero remainder is left as zero.

**Edge cases and quirks**

- The empty string produces `0` because both loops are skipped and the initial totals remain zero. This is an arithmetic result, not proof that empty data is a valid GS1 structure.
- The input is not trimmed. Whitespace, brackets, separators and non-digit characters reach `StrToInt` one character at a time and normally raise `EConvertError`.
- `Copy` uses one-based string positions in this path. Because each loop runs only while its position is greater than zero, it does not request an out-of-range digit.
- Arbitrary lengths are accepted. The weight orientation remains anchored to the rightmost character.
- The totals and result use Delphi `Integer`. Extremely long inputs can overflow; the function does not set a maximum or provide checked wide arithmetic.

**Side effects**

The function uses local arithmetic and temporary one-character strings only. It does not mutate its input or any shared state.

**Performance and concurrency**

The two passes together process every character once, so time is linear in input length and auxiliary arithmetic storage is constant. Each digit extraction creates a temporary string. The function has no shared state and is re-entrant.

**Related entries**

- [`CheckDigit`](CheckDigit.md) uses a similar weighting scheme but returns `10` instead of `0` for a zero remainder.
- [`EAN13toEAN128`](EAN13toEAN128.md) calls `CheckSum` after constructing its 13-digit legacy data value.

**External references**

- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [Free Pascal: `Length`](https://www.freepascal.org/docs-html/rtl/system/length.html)
- [Free Pascal: `Copy`](https://www.freepascal.org/docs-html/rtl/system/copy.html)
- [Free Pascal: `StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html)
- [Embarcadero DocWiki: `System.Length`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Length)
- [Embarcadero DocWiki: `System.Copy`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Copy)
- [Embarcadero DocWiki: `System.SysUtils.StrToInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt)

<small>Created 2026-07-15</small>
