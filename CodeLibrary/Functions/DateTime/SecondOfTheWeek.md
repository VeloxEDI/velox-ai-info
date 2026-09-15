---
title: "SecondOfTheWeek"
description: "Returns the zero-based second index within the Monday-based ISO week."
sidebar_position: 129
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - seconds
  - iso-week
  - index
---

```Delphi
Function SecondOfTheWeek( const AValue : TDateTime) : LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 7, 1, 2, 3, 900); // Tuesday
  Value := SecondOfTheWeek(InputValue); // 90123
end;
```

### Usage

`SecondOfTheWeek` returns the zero-based second index within the Monday-based ISO week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose position within its ISO week is required. |

**Returns**

A `LongWord` from zero at Monday 00:00:00 through 604,799 at Sunday 23:59:59.

**Behaviour**

- The result resets every Monday at encoded midnight.
- Milliseconds are discarded.
- ISO week-year ownership can differ from calendar-year ownership near New Year, but this index only needs the Monday-based weekday.
- No timezone conversion occurs.

**Errors**

Core date/time conversion errors propagate.

**Usage notes**

Use `StartOfTheWeek` to obtain the encoded Monday boundary itself.

### Additional Technical Info
`SecondOfTheWeek` returns the zero-based whole-second position in the ISO week containing the value. ISO weeks begin on Monday.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.SecondOfTheWeek`. It combines `SecondOf` with `MinuteOfTheWeek * 60`. The minute chain derives a Monday-one ISO weekday from Delphi's date/time timestamp.

**Edge cases and quirks**

- The result is always based on seven encoded 86,400-second days, not real elapsed seconds through DST transitions.
- Invalid values can raise in the decode/timestamp chain.
- The unsigned return type fits the full weekly range.
- Free Pascal documents the same Monday-based week model.

**Side effects**

None.

**Performance and concurrency**

Constant-time field extraction and arithmetic with no shared mutable state.

**Related entries**

- [`StartOfTheWeek`](StartOfTheWeek.md) returns Monday midnight.
- [`MilliSecondOfTheWeek`](MilliSecondOfTheWeek.md) includes milliseconds.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheWeek)
- [Free Pascal `SecondOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/secondoftheweek.html)

<small>Created 2026-07-15</small>
