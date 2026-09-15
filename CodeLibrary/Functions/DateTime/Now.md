---
title: "Now"
description: "Returns the Windows host's current local date and time as an untagged `TDateTime`."
sidebar_position: 108
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - local-time
  - system-clock
---

```Delphi
function Now: TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Now; // current local date and time on the executing Velox host
end;
```

### Usage

`Now` returns the Windows host's current local date and time as an untagged `TDateTime`.

**Returns**

The host-local current date and time as an untagged `TDateTime`, with the millisecond field supplied by the Windows local-clock snapshot.

**Behaviour**

- The timezone, daylight-saving state and clock adjustment are those of the machine executing the script, not necessarily the Velox Designer workstation or a source system.
- Each call reads the system clock again. Two adjacent calls are not guaranteed to be equal.
- One Windows snapshot supplies both date and time fields, so the function does not combine separate reads that could cross midnight.
- The result is an encoded wall-clock value; `TDateTime` itself contains no timezone metadata.

**Errors**

The current Windows snapshot contains valid field ranges under normal operation. Unexpected date/time encoding failures are not caught or translated by Velox.

**Usage notes**

Capture `Now` once and reuse it when several calculations must share an identical reference instant. Use `NowUTC` when the script contract explicitly requires current UTC calendar fields.

### Additional Technical Info
`Now` reads the executing Windows host's current local calendar date and wall-clock time and returns the fields as a Delphi `TDateTime`. The value is environment-dependent and carries no timezone identifier or UTC flag.

The example is source-reviewed and intentionally environment-dependent. It was not executed by the documentation workflow.

**Implementation**

Velox's modified PascalScript date import registers Delphi `System.SysUtils.Now` directly. On the installed Windows Delphi 37.0 runtime, `Now` calls `GetLocalTime` once, then combines that single `SYSTEMTIME` snapshot through `EncodeDate` and `EncodeTime`.

**Edge cases and quirks**

- Running the same script in Velox Designer and Velox Service can produce different values if they execute at different times or on hosts with different timezone settings.
- The returned millisecond field does not guarantee that the physical clock has true millisecond accuracy or resolution.
- The local clock can move backwards or forwards because of daylight-saving changes, administrator changes or clock synchronisation. Do not use successive `Now` values as a monotonic performance timer.
- Serialising the value without its timezone context makes later interpretation ambiguous.

**Side effects**

Reads the Windows local system clock. It does not change the clock or other process state.

**Performance and concurrency**

Constant-time operating-system clock access and date/time encoding. The call is safe to make concurrently, but concurrent callers can observe different instants or a host clock adjustment.

**Related entries**

- [`NowUTC`](NowUTC.md) reads current UTC fields instead of host-local fields.
- [`IsToday`](IsToday.md) compares against the host's current local date.

**External references**

- [Embarcadero `System.SysUtils.Now`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Now)
- [Free Pascal `Now`](https://www.freepascal.org/docs-html/rtl/sysutils/now.html)

<small>Created 2026-07-15</small>
