---
title: "DecodeDate"
description: "Writes the calendar year, month and day components of a TDateTime value to caller variables."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - decoding
  - calendar
  - var-parameters
  - delphi
---

```Delphi
procedure DecodeDate(const DateTime: TDateTime; var Year, Month, Day: Word);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  YearValue, MonthValue, DayValue: Word;
begin
  DecodeDate(EncodeDate(2026, 7, 18), YearValue, MonthValue, DayValue);
  Value := YearValue * 10000 + MonthValue * 100 + DayValue; // 20260718
end;
```

### Usage

`DecodeDate` writes the calendar year, month and day components of a TDateTime value to caller variables.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime`, `const` | Encoded value to decode. Its time component is ignored for the date outputs. |
| `Year` | `Word`, `var` | Overwritten with the Gregorian year for a valid value. |
| `Month` | `Word`, `var` | Overwritten with `1..12` for a valid value. |
| `Day` | `Word`, `var` | Overwritten with `1..31` as permitted by the decoded month/year. |

**Behaviour**

The output is based entirely on the encoded calendar date. The procedure does not return a success flag and does not preserve previous output values.

**Errors**

Valid values do not raise. Unsupported non-finite or overflowing timestamp inputs have no function validation; any RTL numeric exception propagates.

### Additional Technical Info
`DecodeDate` decomposes the calendar portion of a `TDateTime` into separate year, month and day outputs. All three caller variables are overwritten.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript runtime registers the procedure directly to Delphi 37.0 `System.SysUtils.DecodeDate`. It calls the RTL's `DecodeDateFully`, discarding that helper's day-of-week result. `DecodeDateFully` converts the value to a Delphi timestamp, splits its day count across 400-, 100-, four- and one-year Gregorian cycles, then walks the common/leap month table.

**Edge cases and quirks**

- A negative `TDateTime` does **not** automatically mean an invalid/BC date. Ordinary dates before the 1899 epoch are valid and decode normally under Delphi's negative representation.
- When the converted timestamp date is before 1 January of year 1, Delphi writes `0` to all three outputs and returns no error flag. The first supported day itself decodes normally. Callers processing arbitrary raw numeric values must check for `Year = 0`.
- A valid `0.0` value decodes to `1899`, `12`, `30`; it is not failure.
- The script declaration uses `var`, while current Delphi/FPC documentation may show `out` in some generated signatures. In this binding all outputs are written, so their incoming values have no meaning.
- No timezone conversion occurs before decoding.

**Side effects**

Only the three caller variables are changed.

**Performance and concurrency**

Constant bounded calendar arithmetic/table scanning, no allocation or shared state. Separate caller variables are safe in concurrent executions.

**Related entries**

- [`DecodeTime`](DecodeTime.md) decomposes the time of day.
- [`DecodeDateTime`](DecodeDateTime.md) calls both date and time decoders.
- [`DecodeDateDay`](DecodeDateDay.md) returns year and day-of-year instead of month/day.

**External references**

- [Embarcadero `System.SysUtils.DecodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DecodeDate) - documents the exact Delphi routine and zero outputs for dates before its supported boundary.
- [Free Pascal `DecodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/decodedate.html) - documents the compatible decomposition and dialect parameter modes.

<small>Created 2026-07-15</small>
