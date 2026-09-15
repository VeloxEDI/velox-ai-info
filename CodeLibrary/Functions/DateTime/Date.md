---
title: "Date"
description: "Returns the current local calendar date as a TDateTime value at midnight."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - local-time
  - clock
  - delphi
---

```Delphi
function Date: TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DateToStr(Date);
end;
```

### Usage

Returns the current local calendar date as a TDateTime value at midnight.

**Returns**

The host's current local year, month and day encoded as `TDateTime`, with a time component of `00:00:00.000`.

**Behaviour**

The value represents the calendar date configured for the Windows host. It contains no timezone identifier or UTC offset. Calling it on either side of local midnight can return different dates, including within one long-running flow.

**Errors**

There is no explicit error handler in the script binding. Normal Windows dates are valid for `EncodeDate`; any unexpected RTL/OS exception propagates into the script.

**Usage notes**

Capture `Date` once in a local variable when a multi-step calculation must use one stable "today" value. Use `DateUTC` when the business rule is explicitly based on the UTC calendar date.

### Additional Technical Info
`Date` reads the Velox host's current local calendar date and returns it at midnight. It is a clock operation: the result depends on when and where the script executes.

The example is safe and source-reviewed. It was not executed by the documentation workflow because its output is intentionally host- and time-dependent.

**Implementation**

The modified PascalScript date/time library registers the script name directly to `System.SysUtils.Date`. In the Windows branch used by Velox, Delphi calls `GetLocalTime`, then passes the returned `wYear`, `wMonth` and `wDay` to `EncodeDate`. The terminal is Delphi RTL plus the Windows local clock.

**Edge cases and quirks**

- This is the machine's local date, which can differ from a user's workstation date and from [`DateUTC`](DateUTC.md).
- A Windows timezone, clock or date change becomes visible on a later call. The routine does not cache the first value used by a map.
- Midnight is a numeric time fraction of zero; no indication remains that the value came from the system clock.
- Free Pascal exposes the same concept, but platform clock and timezone acquisition are implementation-specific. Velox uses Delphi's Windows branch.

**Side effects**

No persistent state is changed. Reading the operating-system clock is an observable external input.

**Performance and concurrency**

Constant-time OS clock read and scalar encoding. Concurrent callers can legitimately observe different dates at a midnight or clock-change boundary.

**Related entries**

- [`DateUTC`](DateUTC.md) reads the UTC rather than local calendar date.
- [`DateOf`](DateOf.md) strips time from an existing value without reading the clock.
- [`DateToStr`](DateToStr.md) formats a date with process-wide settings.

**External references**

- [Embarcadero `System.SysUtils.Date`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Date) - documents the exact Delphi function registered by Velox.
- [Free Pascal `Date`](https://www.freepascal.org/daily/doc/rtl/sysutils/date.html) - documents the equivalent Free Pascal clock function.

<small>Created 2026-07-15</small>
