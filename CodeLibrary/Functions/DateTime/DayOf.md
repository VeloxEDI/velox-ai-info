---
title: "DayOf"
description: "Returns the day-of-month component of a TDateTime value in the range 1 through 31."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - calendar
  - day-of-month
  - delphi
---

```Delphi
Function DayOf(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DayOf(EncodeDate(2026, 7, 18)); // 18
end;
```

### Usage

`DayOf` returns the day-of-month component of a TDateTime value in the range 1 through 31.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time value whose day-of-month is required. Time and timezone meaning do not affect the component. |

**Returns**

A `Word` from `1` to `31` for a valid date.

**Behaviour**

The date portion alone determines the result. Leap years and month lengths matter to the validity of the original date, but no separate month-length calculation is performed here.

**Errors**

Valid `TDateTime` values do not raise. Unsupported non-finite or out-of-domain values are not validated by the binding.

### Additional Technical Info
`DayOf` extracts the calendar day within the month from a `TDateTime`. For a valid Delphi date, the result is between `1` and `31`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DayOf`. It calls `System.SysUtils.DecodeDate(AValue, Year, Month, Result)` and discards the decoded year and month.

**Edge cases and quirks**

- `DayOfTheMonth` is an exact wrapper around `DayOf` in the installed Delphi source; it does not use a different ordinal convention.
- Raw `TDateTime` values before Delphi's supported year 1 boundary cause `DecodeDate` to return zero components. In that unsupported case this function can return `0`, outside the documented valid range, rather than raising locally.
- The value `0.0` is valid and represents 30 December 1899, so `DayOf(0.0)` returns `30`.
- No timezone conversion occurs. A UTC and local value with different encoded dates can return different components.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar decoding with no allocation or shared state.

**Related entries**

- [`DayOfTheMonth`](DayOfTheMonth.md) is the same operation under an ordinal-style name.
- [`DayOfTheYear`](DayOfTheYear.md) returns the day within the year.
- [`DecodeDate`](DecodeDate.md) returns year, month and day together.

**External references**

- [Embarcadero `System.DateUtils.DayOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOf) - documents the exact Delphi function and valid result range.
- [Free Pascal `DayOf`](https://www.freepascal.org/docs-html/rtl/dateutils/dayof.html) - documents the compatible Free Pascal routine.

<small>Created 2026-07-15</small>
