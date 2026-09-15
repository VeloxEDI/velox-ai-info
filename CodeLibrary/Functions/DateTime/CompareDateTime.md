---
title: "CompareDateTime"
description: "Compares two TDateTime values to timestamp precision and returns -1, 0 or 1."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - comparison
  - precision
  - delphi
---

```Delphi
Function CompareDateTime(const A, B: TDateTime): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDate(2026, 7, 18) + EncodeTime(9, 0, 0, 250);
  SecondValue := EncodeDate(2026, 7, 18) + EncodeTime(9, 0, 0, 500);
  Value := CompareDateTime(FirstValue, SecondValue); // -1
end;
```

### Usage

`CompareDateTime` compares two TDateTime values to timestamp precision and returns -1, 0 or 1.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First timestamp to compare. |
| `B` | `TDateTime`, `const` | Second timestamp to compare. |

**Returns**

`-1` when `A` is earlier than `B`, `0` when both encode the same date and millisecond time, or `1` when `A` is later.

**Behaviour**

All date and time components matter. The relationship is chronological at the Velox timestamp's millisecond resolution, not a comparison of timezones or instants described by external metadata.

**Errors**

Valid `TDateTime` values do not raise. The function does not validate NaN, infinity or arbitrary out-of-range `Double` values; timestamp conversion of such values is unsupported.

### Additional Technical Info
`CompareDateTime` chronologically orders two complete `TDateTime` values. Equality is based on their decoded date and millisecond timestamp rather than exact equality of the underlying `Double` bits.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils scripting import binds directly to Delphi 37.0 `System.DateUtils.CompareDateTime`. The routine first calls `SameDate`. For values on the same date it delegates to `CompareTime`, which converts each time of day to an integer millisecond count. For different dates it tests `SameDateTime` using `DateTimeToTimeStamp` date/time fields, then uses numeric ordering. The same-date branch is deliberate: it produces correct chronological ordering for negative `TDateTime` values, whose fractional time convention makes raw `Double` ordering counter-intuitive within a pre-epoch day.

**Edge cases and quirks**

- Values whose `Double` representations differ below the millisecond can compare equal after timestamp conversion.
- For dates before 30 December 1899, a more negative fractional magnitude represents a later time on the same date. The routine's `SameDate`/`CompareTime` path corrects the raw numeric ordering for that case.
- No timezone is stored or converted. A local clock value and a UTC clock value can only be compared meaningfully if the caller has normalised them first.
- Free Pascal offers the same named routine, but its current implementation/version is compatibility information rather than proof of the installed Delphi millisecond behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time scalar/timestamp conversion with no heap allocation or shared state.

**Related entries**

- [`CompareDate`](CompareDate.md) ignores time of day.
- [`CompareTime`](CompareTime.md) ignores the date.

**External references**

- [Embarcadero `System.DateUtils.CompareDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.CompareDateTime) - documents the installed routine's millisecond equality contract.
- [Free Pascal `CompareDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/comparedatetime.html) - documents the compatible Free Pascal operation.

<small>Created 2026-07-15</small>
