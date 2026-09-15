---
title: EIGHT_HOUR_MILL
description: "Defines a Velox nominal eight-hour interval as 28,800,000 milliseconds."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, milliseconds, eight-hours, interval]
---

```Delphi
EIGHT_HOUR_MILL = 28800000
```

### Example

```Delphi
function IsLongerThanEightHours(const ElapsedMilliseconds: Int64): Boolean;
begin
  Result := ElapsedMilliseconds > EIGHT_HOUR_MILL;
end;
```

### Usage

`EIGHT_HOUR_MILL` defines a Velox nominal eight-hour interval as 28,800,000 milliseconds.

### Additional Technical Info
The Velox date-tools importer calculates `EIGHT_HOUR_MILL` as `ONE_HOUR_MILLI * 8` and registers the resulting signed `LongInt`. The published identifier ends in singular `_MILL`; use that exact spelling.

The value represents eight nominal hours measured in milliseconds: `8 * 60 * 60 * 1000`. It contains no start instant, timezone or daylight-saving rule. A local work period that crosses a clock change may not contain this many real elapsed milliseconds even when wall-clock labels differ by eight hours.

Use it only when the surrounding value is known to be milliseconds. Do not add 28,800,000 directly to a `TDateTime`, whose unit is days. For calendar hours use [`IncHour`](../../Functions/DateTime/IncHour.md); for elapsed timestamps ensure both endpoints use the same UTC/monotonic basis.

The constant itself fits `LongInt`, but repeated multiplication or accumulation can overflow signed 32-bit arithmetic. Promote to [`Int64`](../../Types/DataTypes/Int64.md) before scaling. The example is source-reviewed only; no elapsed interval was measured.

**Related Code Library entries**

- [ONE_HOUR_MILLI](ONE_HOUR_MILLI.md) - base one-hour value.
- [MSecPerDay](MSecPerDay.md) - nominal 24-hour millisecond day.

**External references**

- [Embarcadero date/time support](https://docwiki.embarcadero.com/RADStudio/Athens/en/Date_and_Time_Support) - Delphi date/time units and routines.
- [Free Pascal DateUtils](https://www.freepascal.org/docs-html/rtl/dateutils/index.html) - compatible duration/calendar helper context; this uppercase constant is Velox-owned.

<small>Created 2026-07-15</small>
