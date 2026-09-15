---
title: ONE_HOUR_MILLI
description: "Defines a Velox nominal one-hour interval as 3,600,000 milliseconds."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, milliseconds, hour, interval]
---

```Delphi
ONE_HOUR_MILLI = 3600000
```

### Example

```Delphi
function HoursToMilliseconds(const Hours: Integer): Int64;
begin
  Result := Int64(Hours) * ONE_HOUR_MILLI;
end;
```

### Usage

`ONE_HOUR_MILLI` defines a Velox nominal one-hour interval as 3,600,000 milliseconds.

### Additional Technical Info
The Velox date-tools importer registers `ONE_HOUR_MILLI` as a signed `LongInt`. It represents `60 * 60 * 1000` nominal milliseconds. The name uses `_MILLI`; it is not a floating `TDateTime` hour fraction.

Use it only when the other value's documented unit is milliseconds. For a `TDateTime`, one nominal hour is `1/24` day and the safer calendar operation is [`IncHour`](../../Functions/DateTime/IncHour.md). For timeouts and performance measurements, use a monotonic elapsed source where available; wall clocks can move.

Scaling large hour counts in LongInt can overflow even though the constant itself fits. Promote before multiplication and validate the allowed duration. A local clock hour that crosses a daylight-saving transition does not necessarily represent 3,600 elapsed seconds.

The example deliberately promotes the first operand to Int64 and was source-reviewed only; no time calculation was executed.

**Related Code Library entries**

- [FIVE_MINS_MILLI](FIVE_MINS_MILLI.md) - nominal five-minute value.
- [EIGHT_HOUR_MILL](EIGHT_HOUR_MILL.md) - eight times this constant.

**External references**

- [Embarcadero date/time support](https://docwiki.embarcadero.com/RADStudio/Athens/en/Date_and_Time_Support) - Delphi date/time unit context.
- [Free Pascal DateUtils](https://www.freepascal.org/docs-html/rtl/dateutils/index.html) - compatible helper context; this uppercase constant is Velox-owned.

<small>Created 2026-07-15</small>
