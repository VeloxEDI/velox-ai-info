---
title: "CompareTime"
description: "Compares only the time-of-day portions of two TDateTime values and returns -1, 0 or 1."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - comparison
  - milliseconds
  - delphi
---

```Delphi
Function CompareTime(const A, B: TDateTime): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EarlierDay, LaterDay: TDateTime;
begin
  EarlierDay := EncodeDate(2026, 7, 18) + EncodeTime(16, 0, 0, 0);
  LaterDay := EncodeDate(2026, 7, 19) + EncodeTime(8, 0, 0, 0);
  Value := CompareTime(EarlierDay, LaterDay); // 1: 16:00 is later than 08:00
end;
```

### Usage

`CompareTime` compares only the time-of-day portions of two TDateTime values and returns -1, 0 or 1.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First value; only its time-of-day is compared. |
| `B` | `TDateTime`, `const` | Second value; only its time-of-day is compared. |

**Returns**

`-1` when the time in `A` is earlier, `0` when both times match to the millisecond, or `1` when the time in `A` is later.

**Behaviour**

The date portion has no effect. `23:00` therefore compares later than `01:00` even if the `23:00` value belongs to the previous calendar day. This routine does not implement an overnight interval or circular clock comparison.

**Errors**

No ordinary exception for valid values. Non-finite or unsupported raw `Double` values are not checked by the binding.

### Additional Technical Info
`CompareTime` orders only the time-of-day components of two values. Their calendar dates are deliberately discarded, so this routine answers "which clock time is earlier?" rather than "which event happened first?".

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.CompareTime`. It converts each argument with `TimeToMilliSeconds`, compares the two integer counts and returns the corresponding `TValueRelationship` value as an `Integer`.

**Edge cases and quirks**

- Equality is millisecond-based. Smaller floating-point differences can disappear during `TDateTime` timestamp conversion.
- Delphi's negative `TDateTime` convention is normalised by the time conversion, so a pre-epoch value's time of day is compared rather than its signed fraction.
- No timezone or daylight-saving rule is consulted.
- The Free Pascal equivalent has the same purpose, but Velox uses the installed Delphi terminal and its exact timestamp conversion.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic with no allocation or shared state.

**Related entries**

- [`CompareDateTime`](CompareDateTime.md) compares the complete timestamp.
- [`CompareDate`](CompareDate.md) compares only the date.
- [`DecodeTime`](DecodeTime.md) exposes the individual time components.

**External references**

- [Embarcadero `System.DateUtils.CompareTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.CompareTime) - documents the exact Delphi routine.
- [Free Pascal `CompareTime`](https://www.freepascal.org/docs-html/rtl/dateutils/comparetime.html) - documents the compatible Free Pascal routine.

<small>Created 2026-07-15</small>
