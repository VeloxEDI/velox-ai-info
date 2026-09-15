---
title: "EndOfAMonth"
description: "Returns the final millisecond of the last calendar day in a supplied valid year and month."
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - boundary
  - leap-year
---

```Delphi
Function EndOfAMonth(const AYear, AMonth: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfAMonth(2028, 2); // 2028-02-29 23:59:59.999
end;
```

### Usage

`EndOfAMonth` returns the final millisecond of the last calendar day in a supplied valid year and month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `AMonth` | `Word`, `const` | Calendar month `1..12`. |

**Returns**

The month-ending date at `23:59:59.999`.

**Errors**

Invalid input propagates the RTL failure. For an invalid month, do not depend on a particular exception class because the table lookup precedes normal date validation.

### Additional Technical Info
`EndOfAMonth` returns the last millisecond of the named calendar month, accounting for month length and leap years.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EndOfAMonth`. The terminal obtains the month length from the `MonthDays` table through `DaysInAMonth`, encodes that final calendar date, then recodes its time to the day's final millisecond.

**Edge cases and quirks**

- February returns day 28 or 29 according to `IsLeapYear(AYear)`.
- The installed implementation indexes its month-length table before `EncodeDate` validates the fields. An out-of-range `AMonth` is therefore an unsafe input and can produce a range/index failure rather than the tidy `EConvertError` a caller might expect from a date encoder. Validate `1..12` before calling.
- The last-millisecond boundary has the same higher-precision filtering caveat as `EndOfADay`.
- No timezone or daylight-saving transition is applied.

**Side effects**

None.

**Performance and concurrency**

Constant-time table lookup and calendar arithmetic. The month table is read-only.

**Related entries**

- [`EndOfTheMonth`](EndOfTheMonth.md) derives the year and month from an existing value.
- [`EndOfAYear`](EndOfAYear.md) returns the equivalent year boundary.

**External references**

- [Embarcadero `System.DateUtils.EndOfAMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfAMonth)
- [Free Pascal `EndOfAMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/endofamonth.html)

<small>Created 2026-07-15</small>
