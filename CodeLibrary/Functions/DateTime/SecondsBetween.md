---
title: "SecondsBetween"
description: "Returns the absolute number of complete seconds between two timestamp-normalised values."
sidebar_position: 131
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - seconds
  - interval
---

```Delphi
Function SecondsBetween( const ANow, AThen : TDateTime) : Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EarlierValue, LaterValue: TDateTime;
begin
  EarlierValue := EncodeDateTime(2026, 7, 16, 9, 0, 0, 0);
  LaterValue := EncodeDateTime(2026, 7, 16, 9, 1, 30, 750);
  Value := SecondsBetween(LaterValue, EarlierValue); // 90
end;
```

### Usage

`SecondsBetween` returns the absolute number of complete seconds between two timestamp-normalised values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | One endpoint. Its name does not require it to be later. |
| `AThen` | `TDateTime`, `const` | Other endpoint. |

**Returns**

A non-negative `Int64` containing the complete-second distance. Any remaining 0-999 milliseconds are discarded.

**Behaviour**

- Argument order does not affect the result.
- Direction is not returned.
- Partial seconds are truncated after the absolute millisecond difference is calculated.
- Timestamp normalisation handles valid pre-epoch and cross-epoch values chronologically.
- No timezone or daylight-saving interpretation is applied.

**Errors**

Date/time conversion and arithmetic exceptions propagate. Velox adds no sentinel or error translation.

**Usage notes**

Use `SecondSpan` only when a fractional result is required and the raw `TDateTime` limitations are acceptable.

### Additional Technical Info
`SecondsBetween` returns the absolute number of complete seconds separating two date/time values after Delphi converts them to chronological millisecond timestamps.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.SecondsBetween`. Each value passes through `DateTimeToMilliseconds`, which uses `DateTimeToTimeStamp` and combines timestamp date and millisecond-of-day fields into an `Int64`. Delphi subtracts the values, takes the absolute result and performs integer division by 1,000.

**Edge cases and quirks**

- Sub-millisecond input differences are first resolved by timestamp conversion.
- This differs materially from `SecondSpan`, which performs raw `Double` subtraction and can be wrong for timed pre-epoch/cross-epoch values.
- The endpoint names are conventional only; no current-clock read occurs.
- Extreme or invalid raw values can fail in timestamp conversion or exceed supported arithmetic ranges.
- Free Pascal documents the same complete-unit API; installed Delphi's timestamp path defines Velox details.

**Side effects**

None.

**Performance and concurrency**

Constant-time conversion and integer arithmetic with no I/O or shared state.

**Related entries**

- [`SecondSpan`](SecondSpan.md) returns a fractional raw span.
- [`MilliSecondsBetween`](MilliSecondsBetween.md) retains millisecond resolution.

**External references**

- [Embarcadero `System.DateUtils.SecondsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondsBetween)
- [Free Pascal `SecondsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/secondsbetween.html)

<small>Created 2026-07-15</small>
