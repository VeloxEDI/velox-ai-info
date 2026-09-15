---
title: "MilliSecondOfTheWeek"
description: "Returns the zero-based millisecond index within the Monday-based ISO week."
sidebar_position: 89
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - iso-week
---

```Delphi
Function MilliSecondOfTheWeek(const AValue: TDateTime): LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 20, 1, 2, 3, 4); // Monday
  Value := MilliSecondOfTheWeek(InputValue); // 3723004
end;
```

### Usage

`MilliSecondOfTheWeek` returns the zero-based millisecond index within the Monday-based ISO week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose position within the ISO week is required. |

**Returns**

A `LongWord` from 0 for Monday 00:00:00.000 through 604,799,999 for Sunday 23:59:59.999.

**Behaviour**

- Monday is day one of the ISO week and therefore the zero-day offset.
- The value increases through Sunday and resets at the following Monday midnight.
- It can cross calendar month and year boundaries without changing the Monday-based rule.
- No locale-specific first-day-of-week setting is consulted.

**Important usage notes**

- This is an encoded field index, not an elapsed timezone-aware duration. Daylight-saving gaps or repeated local times do not alter its arithmetic.
- It does not return an ISO week number or ISO week-year; only the position within the containing week is returned.
- The Velox uses `Cardinal`, equivalent to the exposed unsigned 32-bit `LongWord`.
- Invalid or non-finite input can raise during decoding.

**Usage notes**

Use this entry when the start boundary must be ISO Monday. Do not infer a locale-specific Sunday start from the host machine.

### Additional Technical Info
`MilliSecondOfTheWeek` returns the zero-based position of an encoded date/time within its Monday-to-Sunday ISO week, measured in whole milliseconds from Monday at midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondOfTheWeek`. The routine calculates the ISO weekday-based whole-second index, multiplies it by 1,000 and adds the decoded millisecond component.

**Side effects**

None.

**Errors**

Velox performs no validation or exception translation. Decode failures propagate.

**Performance and concurrency**

Constant-time field extraction and integer arithmetic with no shared mutable state.

**Related entries**

- [`MinuteOfTheWeek`](MinuteOfTheWeek.md) returns the corresponding whole-minute index.
- [`MilliSecondOfTheMonth`](MilliSecondOfTheMonth.md) uses the first day of the calendar month as its boundary.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondOfTheWeek)
- [Free Pascal `MilliSecondOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondoftheweek.html)

<small>Created 2026-07-15</small>
