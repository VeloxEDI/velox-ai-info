---
title: SecsPerDay
description: "Defines a nominal 24-hour day as 86,400 seconds for explicit elapsed-unit conversion."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, seconds, day, duration]
---

```Delphi
SecsPerDay = 86400
```

### Example

```Delphi
function DaysToSeconds(const Days: Integer): Int64;
begin
  Result := Int64(Days) * SecsPerDay;
end;
```

### Usage

`SecsPerDay` defines a nominal 24-hour day as 86,400 seconds for explicit elapsed-unit conversion.

### Additional Technical Info
The modified PascalScript Classes compiler registers `SecsPerDay` from Delphi SysUtils as a signed `LongInt`. It is the nominal product `24 * 60 * 60`.

Use it for explicit conversion where a source or destination contract defines days as fixed 86,400-second intervals. It is not a `TDateTime` value and contains no timezone, date or daylight-saving information.

A local civil day may span 23 or 25 elapsed hours when the timezone offset changes. Conversely, a duration of 86,400 seconds can land at a different local wall-clock time on the next date. Delphi date/time values also do not represent leap seconds. Use `IncDay` for calendar-day semantics and a UTC/instant representation for elapsed-time semantics.

Signed LongInt can hold 24,855 complete 86,400-second days but the next multiplication exceeds its maximum. Promote before multiplication and bound external input. The example uses Int64 and was source-reviewed only; no conversion was executed.

**Related Code Library entries**

- [MSecPerDay](MSecPerDay.md) - nominal milliseconds per day and its 25-day LongInt limit.
- [IncDay](../../Functions/DateTime/IncDay.md) - calendar-day increment.

**External references**

- [Embarcadero System.SysUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils) - declaring Delphi unit.
- [Free Pascal SecsPerDay](https://www.freepascal.org/docs-html/rtl/sysutils/secsperday.html) - compatible constant and formula.

<small>Created 2026-07-15</small>
