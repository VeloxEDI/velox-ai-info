---
title: "CheckDigit"
description: "Calculates a GS1-style decimal check result using alternating 1 and 3 weights."
sidebar_position: 2
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
Function CheckDigit( const aData : string) : integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := CheckDigit('941234554321'); // 9
end;
```

### Usage

`CheckDigit` calculates a GS1-style decimal check result using alternating 1 and 3 weights.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Source characters excluding the check digit. Each character is converted independently to an integer; use the decimal digits `0` through `9`. |

**Returns**

For a weighted sum with remainder `1` through `9`, returns `9` through `1` respectively. In Velox, a zero remainder returns `10` rather than the standard check digit `0`. An empty string also returns `10`.

**Behaviour**

The complete input participates in the calculation. The function does not remove an existing check digit, trim whitespace or restrict the input to a recognised GS1 key length.

**Errors**

`SysUtils.StrToInt` raises `EConvertError` for a character it cannot convert. The function does not catch or translate that exception. An arithmetic overflow can also surface when overflow checking is enabled.

**Usage notes**

`CheckDigit` and `CheckSum` are not aliases. They use equivalent alternating-weight orientation for normal digit strings, but their zero-remainder and empty-input results differ.

### Additional Technical Info
`CheckDigit` scans a decimal data string from left to right, applies alternating factors of `1` and `3`, and returns ten minus the weighted sum modulo ten. For ordinary non-zero remainders this produces the expected GS1 modulo-10 check digit.

**Implementation**

Velox registers the function directly. The implementation obtains the Delphi string `Length`, selects the initial factor index from `Length mod 2`, and scans positions `1` through `Length`. Each one-character indexed string value is passed to `SysUtils.StrToInt`, multiplied by factor `1` or `3`, and added to an `Integer` accumulator. The factor alternates after every character. The final statement is exactly `10 - (sum mod 10)`; it does not apply a second modulo operation.

The parity choice gives the rightmost source digit a factor of `3`: an even-length input starts with factor `1`, while an odd-length input starts with factor `3`.

**Edge cases and quirks**

- A zero remainder produces `10`. GS1's standard calculation subtracts from the nearest equal or higher multiple of ten, so the check digit for a zero remainder is `0`. Callers requiring that standard result must handle this implementation quirk or use `CheckSum`.
- An empty input skips the loop and returns `10` rather than signalling missing data.
- A space, sign, letter or other character that cannot be converted as a standalone integer raises a conversion exception. There is no preliminary digit validation.
- The function accepts arbitrary length. It does not distinguish GTIN-8, GTIN-12, GTIN-13, GTIN-14 or other GS1 structures.
- The accumulator is a Delphi `Integer`. Extremely long inputs can overflow; the outcome then depends on the product build's overflow-checking setting because the function supplies no guard.

**Side effects**

The operation reads its input and local variables only. It does not mutate state, log or perform I/O.

**Performance and concurrency**

Time is linear in the number of characters and auxiliary storage is constant. One conversion is performed per character. The function uses no shared state and is re-entrant.

**Related entries**

- [`CheckSum`](CheckSum.md) returns `0` for a zero remainder and is the safer existing helper when that GS1 result is required.

**External references**

- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [Free Pascal: `Length`](https://www.freepascal.org/docs-html/rtl/system/length.html)
- [Free Pascal: `StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html)
- [Embarcadero DocWiki: `System.Length`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Length)
- [Embarcadero DocWiki: `System.SysUtils.StrToInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt)

<small>Created 2026-07-15</small>
