---
title: "SameDateTime"
description: "Reports whether two values normalise to the same millisecond date/time timestamp."
sidebar_position: 122
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - comparison
  - milliseconds
---

```Delphi
Function SameDateTime( const A, B : TDateTime) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  LeftValue, RightValue: TDateTime;
begin
  LeftValue := EncodeDateTime(2026, 7, 16, 8, 30, 15, 125);
  RightValue := EncodeDateTime(2026, 7, 16, 8, 30, 15, 125);
  Value := SameDateTime(LeftValue, RightValue); // True
end;
```

### Usage

`SameDateTime` reports whether two values normalise to the same millisecond date/time timestamp.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First date/time value. |
| `B` | `TDateTime`, `const` | Second date/time value. |

**Returns**

`True` when both converted timestamps have the same date integer and the same millisecond-of-day integer; otherwise `False`.

**Behaviour**

- The comparison is symmetric and includes year, month, day, hour, minute, second and millisecond.
- Numerically different floating values can compare equal when they convert to the same millisecond timestamp.
- Values one encoded millisecond apart compare unequal.
- No timezone conversion occurs; the values are compared exactly as encoded.

**Errors**

No exception is expected for valid finite `TDateTime` values. Any core conversion exception propagates unchanged.

**Usage notes**

Use this routine for encoded field equality. It does not establish that two separately tagged timezone values represent the same UTC instant because `TDateTime` contains no timezone tag.

### Additional Technical Info
`SameDateTime` compares two values after converting each to Delphi's integer date/time timestamp representation. Date and time must match at millisecond resolution.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.SameDateTime`. It calls `DateTimeToTimeStamp` for each argument and compares both `TTimeStamp.Date` and `TTimeStamp.Time`. The conversion handles Delphi's pre-epoch sign representation and maps the floating value to millisecond fields.

**Edge cases and quirks**

- This is millisecond equivalence, not bitwise `Double` equality and not an arbitrary floating tolerance.
- Sub-millisecond differences that map to the same timestamp are intentionally ignored.
- The timestamp conversion makes valid pre-epoch and cross-epoch values comparable by their encoded date/time fields.
- Free Pascal exposes the same API but documents its comparison via `CompareDateTime`; installed Delphi's direct timestamp comparison is the Velox terminal.
- Invalid or non-finite raw values can fail during timestamp conversion rather than returning a defined Boolean.

**Side effects**

None.

**Performance and concurrency**

Constant-time conversion of two values and integer comparison. No I/O, allocation of long-lived resources or shared mutable state.

**Related entries**

- [`SameDate`](SameDate.md) ignores time fields.
- [`SameTime`](SameTime.md) ignores date fields.

**External references**

- [Embarcadero `System.DateUtils.SameDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SameDateTime)
- [Free Pascal `SameDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/samedatetime.html)

<small>Created 2026-07-15</small>
