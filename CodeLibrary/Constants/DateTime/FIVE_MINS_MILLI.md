---
title: FIVE_MINS_MILLI
description: "Defines a Velox nominal five-minute interval as 300,000 milliseconds."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, milliseconds, five-minutes, interval]
---

```Delphi
FIVE_MINS_MILLI = 300000
```

### Example

```Delphi
function WithinFiveMinutes(const ElapsedMilliseconds: Int64): Boolean;
begin
  Result := (ElapsedMilliseconds >= 0) and
    (ElapsedMilliseconds <= FIVE_MINS_MILLI);
end;
```

### Usage

`FIVE_MINS_MILLI` defines a Velox nominal five-minute interval as 300,000 milliseconds.

### Additional Technical Info
The Velox date-tools importer registers `FIVE_MINS_MILLI` as a signed `LongInt`. It is exactly `5 * 60 * 1000` nominal milliseconds.

The constant is useful for timeout, age or tolerance comparisons only when the measured input uses milliseconds and a compatible clock basis. It is not a `TDateTime` value and has no timezone, locale or calendar semantics. Adding it directly to a `TDateTime` would add 300,000 days, not five minutes.

For a civil calendar increment use [`IncMinute`](../../Functions/DateTime/IncMinute.md). For service timeouts, distinguish wall-clock time from a monotonic elapsed timer: system clock adjustments can make wall-clock differences negative or unexpectedly large.

Scaling many intervals in `LongInt` can overflow; promote to Int64 before multiplication and bound untrusted counts. The example explicitly rejects a negative elapsed value and was source-reviewed only; no timer was run.

**Related Code Library entries**

- [ONE_HOUR_MILLI](ONE_HOUR_MILLI.md) - nominal one-hour milliseconds.
- [MSecPerDay](MSecPerDay.md) - nominal one-day milliseconds.

**External references**

- [Embarcadero date/time support](https://docwiki.embarcadero.com/RADStudio/Athens/en/Date_and_Time_Support) - Delphi date/time representation and routines.
- [Free Pascal DateUtils](https://www.freepascal.org/docs-html/rtl/dateutils/index.html) - compatible helper context; this uppercase constant is Velox-owned.

<small>Created 2026-07-15</small>
