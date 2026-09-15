---
title: "UTCtoLocal"
description: "Adds Velox's sampled current host UTC offset to an untagged encoded date/time value."
sidebar_position: 158
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
Function UTCtoLocal(DateTime: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  UtcValue: TDateTime;
begin
  UtcValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  Value := UTCtoLocal(UtcValue); // Depends on the host's current offset
end;
```

### Usage

`UTCtoLocal` adds Velox's sampled current host UTC offset to an untagged encoded date/time value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime` | Untagged value the caller intends to treat as UTC fields. |

**Returns**

`DateTime + (current local system time - current UTC system time)` as another untagged `TDateTime`.

**Errors**

Windows calls and `SystemTimeToDateTime` are not checked/translated by Velox. Invalid input or arithmetic results can propagate failures or unusable values.

**Usage notes**

Use this function only when the required legacy rule is specifically "add the host's offset now". A rules-aware timezone service is required for reliable historical/future conversion.

### Additional Technical Info
`UTCtoLocal` adds the Windows host's local-minus-UTC offset observed at the moment of the call. Despite its name, it is a legacy current-offset adjustment rather than a date-aware conversion using the timezone rules for `DateTime`.

The example is fictional, environment-dependent and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools import binds to `vxDateTools.UTCtoLocal`. It calls Windows `GetLocalTime`, then `GetSystemTime`, converts both `SYSTEMTIME` snapshots with `SystemTimeToDateTime`, subtracts them to derive the current offset and adds that raw `Double` difference to the input.

It does not call Delphi `TTimeZone.ToLocalTime` or a rules-aware equivalent.

**Edge cases and quirks**

- Historical/future daylight-saving rules for `DateTime` are ignored. A winter timestamp converted while the host is observing summer time receives the summer offset.
- Ambiguous or nonexistent local times around a daylight-saving transition are not identified.
- Local and UTC are read sequentially. A clock tick normally introduces a small skew; a midnight, clock correction or timezone transition between reads can produce a much larger error.
- The final operation is raw `TDateTime` addition. Timed pre-epoch values can be wrong because Delphi's negative-date fractional representation is not normal signed-day arithmetic.
- Passing a value that is already local applies the offset again. The numeric type cannot verify provenance.
- The implementation is Windows-specific and its result depends on the Velox host, not the script author's workstation.

**Side effects**

Reads two host clock snapshots and current timezone-derived local time. It does not modify the input or system clock.

**Performance and concurrency**

Constant-time with two operating-system clock reads. Re-entrant, but nondeterministic across clock/timezone changes.

**Related entries**

- [`LocalToUTC`](LocalToUTC.md) performs the inverse current-offset subtraction and shares the same limitations.
- [`UTCOffsetString`](UTCOffsetString.md) formats a current offset through different sampling code.
- [`UnixToDateTime`](UnixToDateTime.md) returns an untagged epoch-arithmetic value.

**External references**

These pages describe rules-aware upstream operations for comparison, not the terminal used by Velox:

- [Embarcadero `TTimeZone.ToLocalTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TTimeZone.ToLocalTime)
- [Free Pascal `UniversalTimeToLocal`](https://www.freepascal.org/docs-html/rtl/dateutils/universaltimetolocal.html)

<small>Created 2026-07-15</small>
