---
title: "DecodeDateDay"
description: "Writes the calendar year and one-based day-of-year components of a TDateTime value."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - decoding
  - day-of-year
  - leap-year
  - var-parameters
  - delphi
---

```Delphi
Procedure DecodeDateDay(const AValue: TDateTime; var AYear, ADayOfYear: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  YearValue, DayValue: Word;
begin
  DecodeDateDay(EncodeDate(2024, 12, 31), YearValue, DayValue);
  Value := YearValue * 1000 + DayValue; // 2024366
end;
```

### Usage

`DecodeDateDay` writes the calendar year and one-based day-of-year components of a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose calendar date is decoded; time is ignored. |
| `AYear` | `Word`, `var` | Overwritten with the calendar year. |
| `ADayOfYear` | `Word`, `var` | Overwritten with `1..365`, or `1..366` for a leap year. |

**Behaviour**

January 1 returns day `1`. Leap day and all following days are shifted by one in a leap year. Both output variables are overwritten.

**Errors**

Valid dates do not raise. An invalid decoded year can propagate an encoding `EConvertError`; unsupported numeric values can propagate conversion errors.

### Additional Technical Info
`DecodeDateDay` decomposes a date into its calendar year and one-based ordinal day within that year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DecodeDateDay`. The routine sets `AYear := YearOf(AValue)`, then sets `ADayOfYear := DayOfTheYear(AValue)`. The latter subtracts the encoded start of that year from the truncated input date and adds one.

**Edge cases and quirks**

- The result is based on calendar ordinals, not elapsed 24-hour periods from the exact input time.
- An unsupported date that decodes year `0` is not safely represented: the subsequent start-of-year calculation attempts to encode year `0` and can raise `EConvertError` instead of returning zero outputs.
- The script exposes Delphi `out` semantics as `var`; incoming output-variable contents are ignored.
- Free Pascal documents the same outputs. Velox uses the installed Delphi helper chain and its exact invalid-year behaviour.

**Side effects**

Only `AYear` and `ADayOfYear` are changed.

**Performance and concurrency**

Constant-time decode, encode and arithmetic with no shared state.

**Related entries**

- [`DayOfTheYear`](DayOfTheYear.md) returns only the ordinal.
- [`DecodeDate`](DecodeDate.md) returns calendar month and day instead.
- [`DecodeDateWeek`](DecodeDateWeek.md) uses ISO week-numbering fields.

**External references**

- [Embarcadero `System.DateUtils.DecodeDateDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DecodeDateDay) - documents the exact Delphi outputs.
- [Free Pascal `DecodeDateDay`](https://www.freepascal.org/docs-html/rtl/dateutils/decodedateday.html) - documents the compatible Free Pascal operation.

<small>Created 2026-07-15</small>
