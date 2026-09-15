---
title: TDateTime
description: Stores a timezone-free Delphi date/time as Double days relative to 30 December 1899.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, tdatetime, date, time, serial, timezone]
---

```Delphi
TDateTime
```

### Example

```Delphi
procedure BuildTimestamp(var Timestamp: TDateTime);
begin
  Timestamp := EncodeDate(2026, 7, 20) + EncodeTime(14, 30, 0, 0);
end;
```

### Usage

Use `TDateTime` for date and time values passed between Velox fields and scripting functions. Build values with routines such as `EncodeDate`, `EncodeTime` or `EncodeDateTime`, and use the Date & Time functions for decoding, formatting, comparison and calendar arithmetic.

A `TDateTime` does not record whether it represents local time or UTC. Decide and preserve that meaning in the surrounding configuration, then convert explicitly at system boundaries. Raw addition is suitable for simple fixed durations—`1` is one day—but use calendar-aware functions for months, years and daylight-saving-sensitive work.

### Additional Technical Info

Velox registers `TDateTime` directly as PascalScript `btDouble`. Delphi interprets the whole-number part as days relative to `1899-12-30` and the fractional magnitude as time of day.

The value has no timezone, UTC/local flag, calendar identifier or offset. `Now` returns local server time; Velox UTC helpers return a UTC clock represented in the same timezone-free numeric type. Track the intended basis separately and convert explicitly at boundaries.

Use DateUtils/Velox date functions for calendar arithmetic, month/year boundaries and decoding. Adding `1` means one day and `1/24` one hour in raw serial arithmetic, but that does not model daylight-saving transitions or month length.

Negative serials have Delphi-specific date/time interpretation; do not derive pre-epoch dates by casually separating `Trunc` and `Frac`. Use Encode/Decode functions. Double precision also means it cannot represent arbitrarily fine time throughout the full date range.

Text parsing/formatting can be locale-dependent unless a format-aware/invariant helper is used. Database/JSON/RFC timestamps need an explicit timezone and format contract; never serialize the raw Double unless both ends explicitly agree on Delphi serial semantics.

See the [`Date & Time functions`](../../Functions/DateTime.md) for supported construction, extraction, comparison and conversion operations.

The example is source-reviewed only; no timestamp was encoded.

**External references**

- [Embarcadero TDateTime](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime) - Delphi epoch and representation.
- [Free Pascal TDateTime](https://www.freepascal.org/docs-html/rtl/sysutils/tdatetime.html) - compatible serial-date reference.

<small>Created 2026-07-15</small>
