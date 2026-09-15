---
title: "Time"
description: "Returns the Windows host's current local time of day as an untagged `TDateTime` fraction."
sidebar_position: 142
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - current-time
  - windows
  - local-time
---

```Delphi
function Time: TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Time; // Current local time on the executing Velox host
end;
```

### Usage

Returns the Windows host's current local time of day as an untagged `TDateTime` fraction.

**Returns**

A non-negative `TDateTime` time fraction from midnight through 23:59:59.999, based on the host clock at the call.

**Behaviour**

- The result uses the timezone and daylight-saving state currently configured on the machine running this Velox process.
- One Windows snapshot supplies all fields, so the value cannot mix clock fields from separate reads.
- The result is untagged: it contains no timezone, offset or local/UTC marker.
- Repeated calls can return different values and the clock wraps to zero at local midnight.

**Errors**

The Windows branch normally does not raise for an ordinary clock read. Any encoder failure would propagate; Velox does not translate it.

**Usage notes**

Use `Now` when both the current local date and time are needed. Do not subtract two `Time` values across midnight to measure an interval.

### Additional Technical Info
`Time` reads the executing Windows host's current local clock fields and returns only the time-of-day portion as a `TDateTime`.

The example is source-reviewed and intentionally environment-dependent. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript date library exposes `Time` and runtime-registers `System.SysUtils.Time` directly. In the installed Delphi 37.0 Windows branch, SysUtils calls `GetLocalTime` once, then passes the snapshot's hour, minute, second and millisecond fields to `EncodeTime`. No date field is included.

**Edge cases and quirks**

- Millisecond fields are present, but actual clock resolution/accuracy depends on Windows and the host clock source.
- The system clock can jump forwards or backwards because of administrative changes or clock synchronisation. `Time` is not monotonic and must not measure elapsed durations.
- A call around local midnight returns only a time fraction, so it cannot identify which date supplied that time.
- Free Pascal documents a comparable current-time function but its platform implementation is not evidence for the installed Windows Delphi path.

**Side effects**

None beyond reading the operating-system clock.

**Performance and concurrency**

Constant-time Windows clock read and encoding. Thread-safe for ordinary use, but different threads/calls can observe different instants or a host clock adjustment.

**Related entries**

- [`Now`](Now.md) returns current local date and time from one snapshot.
- [`Today`](Today.md) returns the current local date at midnight.

**External references**

- [Embarcadero `System.SysUtils.Time`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Time)
- [Free Pascal `Time`](https://www.freepascal.org/docs-html/rtl/sysutils/time.html)

<small>Created 2026-07-15</small>
