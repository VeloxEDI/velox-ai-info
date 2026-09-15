---
title: "DateUTC"
description: "Returns the current UTC calendar date at midnight by reading the Windows system clock."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - utc
  - clock
  - windows
---

```Delphi
Function DateUTC: TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DateToStr(DateUTC);
end;
```

### Usage

`DateUTC` returns the current UTC calendar date at midnight by reading the Windows system clock.

**Returns**

The current UTC date encoded as `TDateTime` with a zero time component. The returned number contains no timezone marker despite being derived from UTC.

**Behaviour**

The date can differ from [`Date`](Date.md) whenever the host's local timezone is on another side of midnight from UTC. The result changes at UTC midnight, not local midnight.

**Errors**

There is no local exception handler. Windows supplies an encodeable date during ordinary operation; an unexpected OS or Velox encoding failure propagates.

**Usage notes**

Capture this function once when all records in a flow must share one UTC business date. Use a full UTC timestamp source when ordering events within that date.

### Additional Technical Info
`DateUTC` reads the Windows system clock in UTC and returns its current calendar year, month and day at midnight. It discards the current UTC time of day.

The example is safe and source-reviewed. It was not executed because its value is intentionally clock-dependent.

**Implementation**

The Velox date-tools import registers this name to the Velox-owned `DateUTC` helper. On Windows it calls `GetSystemTime(TSystemTime)`, then passes `wYear`, `wMonth` and `wDay` to Delphi `EncodeDate`. `GetSystemTime` supplies UTC fields; `GetLocalTime` is not called. A nearby source comment describes the clock imprecisely, but the API used by the executable is unambiguous.

**Edge cases and quirks**

- Time is deliberately discarded. `DateUTC` is not equivalent to a current UTC timestamp and cannot be used alone to calculate an exact Unix time.
- The `TDateTime` result has no timezone metadata. Later formatting treats it as an ordinary calendar value; the caller must retain its UTC meaning.
- The function reads the clock on every call. A flow spanning UTC midnight can receive different values unless it captures one result.
- `DateToStr(DateUTC)` formats with process-wide locale settings; UTC affects the date fields, not their text format.
- No official Free Pascal or Delphi routine named `DateUTC` is the terminal. The external references document the core `EncodeDate` helper used after the Windows UTC read.

**Side effects**

No state is changed. The Windows UTC clock is an observable external input.

**Performance and concurrency**

Constant-time OS clock read and scalar encoding. Concurrent calls can legitimately straddle UTC midnight or a system clock adjustment.

**Related entries**

- [`Date`](Date.md) returns the current local date.
- [`DateTimeToUnix`](DateTimeToUnix.md) converts an already prepared date/time value to epoch seconds without timezone conversion.

**External references**

- [Embarcadero `System.SysUtils.EncodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeDate) - documents the Delphi encoder used by the Velox helper.
- [Free Pascal `EncodeDate`](https://www.freepascal.org/daily/doc/rtl/sysutils/encodedate.html) - documents the compatible encoder and valid calendar ranges.

<small>Created 2026-07-15</small>
