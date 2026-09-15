---
title: "ModifiedJulianDateToDateTime"
description: "Converts a Modified Julian date, whose integer boundary is midnight, to a millisecond-resolution `TDateTime`."
sidebar_position: 101
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - modified-julian-date
  - conversion
---

```Delphi
Function ModifiedJulianDateToDateTime(const AValue: Double): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ModifiedJulianDateToDateTime(60000.0); // 25 February 2023 at midnight
end;
```

### Usage

`ModifiedJulianDateToDateTime` converts a Modified Julian date, whose integer boundary is midnight, to a millisecond-resolution `TDateTime`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Double`, `const` | Modified Julian date. The integer portion identifies a midnight boundary and the fractional portion identifies the time since that midnight. |

**Returns**

The corresponding proleptic-Gregorian `TDateTime`, rounded to Velox's millisecond conversion resolution. The result has no timezone or time-scale tag.

**Behaviour**

- Modified Julian date zero represents 17 November 1858 at 00:00:00.000 in the adopted calendar conversion.
- Adding `1.0` advances one day; adding `0.5` advances twelve hours.
- The returned calendar fields use Velox's proleptic Gregorian encoder.
- No UTC, TT or other astronomical time-scale conversion is performed. The numeric scale is interpreted exactly as supplied.

**Errors**

An unencodable or non-finite input raises `EConvertError` through the Julian-date Velox. Velox does not catch or translate it.

**Usage notes**

Do not pass an ordinary Julian date without first accounting for the 2,400,000.5 offset and its noon boundary.

### Additional Technical Info
`ModifiedJulianDateToDateTime` converts a Modified Julian date number to Delphi's encoded `TDateTime` representation. An integer Modified Julian date changes at midnight rather than at the noon boundary used by an ordinary Julian date.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.ModifiedJulianDateToDateTime`. It adds the fixed offset 2,400,000.5 and delegates to `JulianDateToDateTime`. That terminal derives a Gregorian date, shifts the Julian noon boundary to midnight, converts the fraction to milliseconds and raises when the date cannot be encoded.

**Edge cases and quirks**

- Fractional input is reduced to millisecond resolution; finer precision is rounded by the Julian conversion chain.
- The supported result is limited by Delphi's encodable year range, 1 through 9999. A mathematically valid Julian number outside that range still fails.
- Large `Double` values lose fractional precision before conversion.
- The Free Pascal reference is not behaviourally interchangeable: its published documentation states that its corresponding routine is not implemented and raises. Current Velox uses the installed Delphi implementation, which is implemented.
- The returned `TDateTime` is untagged; callers must carry the intended astronomical or UTC convention separately.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating-point and calendar arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`JulianDateToDateTime`](JulianDateToDateTime.md) accepts the full Julian date number with a noon integer boundary.
- `DateTimeToModifiedJulianDate` performs the inverse conversion.

**External references**

- [Embarcadero `System.DateUtils.ModifiedJulianDateToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.ModifiedJulianDateToDateTime)
- [Free Pascal `ModifiedJulianDateToDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/modifiedjuliandatetodatetime.html)

<small>Created 2026-07-15</small>
