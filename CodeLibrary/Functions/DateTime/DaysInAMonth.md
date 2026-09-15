---
title: "DaysInAMonth"
description: "Returns the number of days in a specified year and month, including leap-year February."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - leap-year
  - validation
  - delphi
---

```Delphi
Function DaysInAMonth(const AYear, AMonth: Word): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DaysInAMonth(2024, 2); // 29
end;
```

### Usage

`DaysInAMonth` returns the number of days in a specified year and month, including leap-year February.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Year used for the February leap-year decision. Use the Velox encodeable range `1..9999` for calendar dates. |
| `AMonth` | `Word`, `const` | Month number. The supported range is `1..12`. |

**Returns**

`28`, `29`, `30` or `31` for a valid year/month pair.

**Behaviour**

Leap years are divisible by 4, except century years not divisible by 400. Thus February 2000 has 29 days while February 1900 has 28.

**Errors**

No exception for a valid pair. Invalid `AMonth` behaviour is deliberately not normalised by Velox; any runtime range/access failure propagates.

**Usage notes**

Use an upstream validation rule or `IsValidDate` before processing untrusted numeric calendar fields.

### Additional Technical Info
`DaysInAMonth` returns the Gregorian length of a supplied month in a supplied year. February is selected from the common-year or leap-year table according to Delphi's divisibility rules.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DaysInAMonth`. The implementation indexes the RTL `MonthDays` table with two dimensions: `(AMonth = 2) and IsLeapYear(AYear)` selects the common/leap row, and `AMonth` selects the month column.

**Edge cases and quirks**

- The installed function performs **no local range validation** before using `AMonth` as an array index. Values outside `1..12` are unsupported and can raise a range error or read an invalid table element depending on the RTL build's range-checking configuration. Validate the month before calling.
- `AYear` is a `Word`, so the signature accepts `0` and values above `9999`. `IsLeapYear` will still apply arithmetic to them even though `EncodeDate` cannot create those years. Keep the year within `1..9999` for an actual Delphi calendar date.
- There is no locale or timezone dependency.
- Free Pascal documents the same valid month/year purpose, but it does not define the error behaviour of this installed Delphi table access.

**Side effects**

None.

**Performance and concurrency**

Constant-time leap calculation and table lookup with no allocation or mutable state.

**Related entries**

- [`DaysInMonth`](DaysInMonth.md) derives year and month from an existing `TDateTime`.
- [`DaysInAYear`](DaysInAYear.md) returns the complete year length.

**External references**

- [Embarcadero `System.DateUtils.DaysInAMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaysInAMonth) - documents the exact Delphi routine for valid inputs.
- [Free Pascal `DaysInAMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/daysinamonth.html) - documents the compatible calendar result.

<small>Created 2026-07-15</small>
