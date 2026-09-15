---
title: "NowUTC"
description: "Returns the Windows system clock's current UTC date and time as an untagged millisecond-resolution `TDateTime`."
sidebar_position: 109
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - utc
  - system-clock
---

```Delphi
Function NowUTC: TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NowUTC; // current UTC fields from the executing Velox host
end;
```

### Usage

`NowUTC` returns the Windows system clock's current UTC date and time as an untagged millisecond-resolution `TDateTime`.

**Behaviour**

- Results are based on the machine that executes the script.
- UTC fields are read directly; the function does not take a local value and apply a timezone offset.
- A single operating-system snapshot supplies all fields, so date and time cannot come from opposite sides of a midnight boundary.
- Every call reads the system clock again.

**Errors**

Under normal Windows operation, the returned fields are valid. Unexpected `EncodeDate` or `EncodeTime` failures propagate because Velox does not catch them.

### Additional Technical Info
`NowUTC` reads the executing Windows host's current UTC calendar and clock fields and encodes them as a `TDateTime`. The numeric result represents UTC by convention only; `TDateTime` does not store a timezone or UTC marker.

The example is source-reviewed and intentionally environment-dependent. It was not executed by the documentation workflow.

**Implementation**

Velox's date-tools import binds to the Velox `NowUTC` wrapper. It calls the Windows `GetSystemTime` API once to obtain one UTC `SYSTEMTIME` snapshot, then adds the results of Delphi `EncodeDate(year, month, day)` and `EncodeTime(hour, minute, second, milliseconds)`.

**Edge cases and quirks**

- The returned `TDateTime` is untagged. Passing it to a routine that assumes local time can cause a double conversion or an incorrect offset.
- The millisecond field is encoded, but actual clock accuracy and resolution depend on Windows and the host's time source.
- UTC avoids daylight-saving discontinuities, but the system clock can still be adjusted by synchronisation or administration. It is not a monotonic timer.
- This is a Velox wrapper, not Delphi's `Now` converted to UTC. The official encoding references document the core field conversion; no same-name Delphi or Free Pascal terminal is called.

**Side effects**

Reads the Windows system clock. It does not change clock or process state.

**Performance and concurrency**

Constant-time operating-system clock access and date/time encoding. Concurrent callers may observe different instants or a system-clock adjustment.

**Remarks**

Capture the value once when one processing decision needs a stable reference instant. Maintain an explicit contract that the untagged result is UTC throughout subsequent storage, formatting and conversion.

**Related entries**

- [`Now`](Now.md) returns current host-local fields.
- [`LocalToUTC`](LocalToUTC.md) applies Velox's legacy local-to-UTC conversion to an existing encoded value and has different caveats.

**External references**

- [Embarcadero `System.SysUtils.EncodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeDate)
- [Embarcadero `System.SysUtils.EncodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeTime)
- [Free Pascal `EncodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/encodedate.html)
- [Free Pascal `EncodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/encodetime.html)

<small>Created 2026-07-15</small>
