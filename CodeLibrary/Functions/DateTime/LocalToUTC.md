---
title: "LocalToUTC"
description: "Subtracts the Windows machine's current local-to-UTC offset from a supplied untagged `TDateTime`."
sidebar_position: 82
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - utc
  - timezone
  - windows
---

```Delphi
Function LocalToUTC(DateTime: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  LocalValue: TDateTime;
begin
  LocalValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  Value := LocalToUTC(LocalValue); // Result depends on the host's current offset
end;
```

### Usage

`LocalToUTC` subtracts the Windows machine's current local-to-UTC offset from a supplied untagged `TDateTime`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime` | Untagged value assumed by the caller to represent local wall-clock fields. |

**Returns**

`DateTime - (current local system time - current UTC system time)`, represented as another untagged `TDateTime`.

**Errors**

Windows conversion failures are not explicitly checked and no function validation is performed. Invalid/non-finite input or an unrepresentable arithmetic result can propagate runtime errors or a non-useful value.

**Usage notes**

Use this helper only when the required legacy rule is specifically “subtract the machine's current offset”. For correct historical/future local-to-UTC conversion, use a rules-aware timezone service and define how ambiguous or invalid local times are handled.

### Additional Technical Info
`LocalToUTC` subtracts the Windows host's local-to-UTC offset observed at the moment of the call from the supplied encoded value. Despite its name, it does not perform date-aware timezone conversion for the date represented by the argument.

The example is fictional and source-reviewed. Its result is intentionally environment-dependent and it was not executed by the documentation workflow.

**Implementation**

This is a Velox date-tools helper rather than a direct DateUtils function. It calls Windows `GetLocalTime`, then `GetSystemTime`, converts both `SYSTEMTIME` structures with Delphi `SystemTimeToDateTime`, subtracts the observed difference from the supplied value and returns the raw numeric result.

It does **not** call Delphi `TTimeZone.ToUniversalTime`, Free Pascal `LocalTimeToUniversal` or another rules-aware conversion API.

**Behaviour**

- On a host currently at UTC+12, the normal observed calculation subtracts approximately 12 hours from the input.
- The offset comes from “now”, not from the date encoded in `DateTime`.
- The result has no UTC flag or timezone object attached. It is only an adjusted number.
- The routine is Windows-dependent because its implementation calls Windows local/system-time APIs.

**Edge cases and quirks**

- Historical and future daylight-saving rules are ignored. Converting a winter date while the host is currently observing summer time applies the summer offset, and conversely.
- Ambiguous or nonexistent local wall times around daylight-saving transitions are not detected.
- The local and UTC clocks are read in two separate calls. A clock tick, midnight boundary, clock correction or offset change between them can introduce a small skew or, at a boundary, a much larger incorrect difference.
- The final subtraction is raw `Double` arithmetic. Delphi's negative/pre-epoch time encoding makes this unsafe for timed values before 30 December 1899.
- Changing the Windows timezone or clock while a flow runs can change results between records.
- The parameter name does not establish provenance. Passing an already-UTC value applies the current offset again.

**Side effects**

Reads the host clock and timezone-derived local time. It does not modify the clock or the input variable.

**Performance and concurrency**

Constant-time with two operating-system clock reads. It is re-entrant, but results are time- and machine-dependent and can vary under concurrent host timezone/clock changes.

**Related entries**

- [`IncHour`](IncHour.md) performs a fixed encoded-hour adjustment without reading the host clock.
- [`IsToday`](IsToday.md) is another host-local-clock-dependent DateUtils predicate.

**External references**

These references describe the actual conversion helper and the rules-aware operations with which this Velox wrapper should be compared:

- [Embarcadero `System.SysUtils.SystemTimeToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.SystemTimeToDateTime)
- [Embarcadero `System.DateUtils.TTimeZone.ToUniversalTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TTimeZone.ToUniversalTime)
- [Free Pascal `LocalTimeToUniversal`](https://www.freepascal.org/docs-html/rtl/dateutils/localtimetouniversal.html)

<small>Created 2026-07-15</small>
