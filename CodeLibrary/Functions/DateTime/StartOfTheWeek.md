---
title: "StartOfTheWeek"
description: "Returns midnight on Monday of the supplied value's ISO week."
sidebar_position: 139
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-week
  - monday
  - boundary
---

```Delphi
Function StartOfTheWeek( const AValue : TDateTime) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 14, 30, 5, 125); // Thursday
  Value := StartOfTheWeek(InputValue); // Monday 13 July 2026
end;
```

### Usage

`StartOfTheWeek` returns midnight on Monday of the supplied value's ISO week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose Monday-based week boundary is required. |

**Returns**

The encoded date of the containing week's Monday at 00:00:00.000.

**Behaviour**

- Monday values return their own date at midnight.
- Tuesday through Sunday move back one through six whole encoded days.
- The result can fall in a different calendar month or year.
- No timezone or daylight-saving rules are applied.

**Errors**

Core conversion errors propagate.

**Usage notes**

Use `StartOfAWeek` when ISO year/week/weekday numbers are already known.

### Additional Technical Info
`StartOfTheWeek` returns encoded midnight on the Monday that begins the ISO week containing `AValue`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.StartOfTheWeek`. Delphi calculates `Trunc(AValue) - (DayOfTheWeek(AValue) - 1)`. `DayOfTheWeek` obtains a Monday-one value from Delphi's timestamp date.

**Edge cases and quirks**

- The function uses ISO Monday as the first day regardless of Windows/user locale week-start preferences.
- It returns an encoded field boundary, not necessarily the UTC instant at which a local timezone's Monday began.
- Invalid raw input can fail in truncation/timestamp conversion.
- Free Pascal documents the same Monday-based boundary.

**Side effects**

None.

**Performance and concurrency**

Constant-time timestamp/date arithmetic with no I/O or shared state.

**Related entries**

- [`StartOfAWeek`](StartOfAWeek.md) encodes supplied ISO fields.
- [`SecondOfTheWeek`](SecondOfTheWeek.md) returns a Monday-zero second index.

**External references**

- [Embarcadero `System.DateUtils.StartOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfTheWeek)
- [Free Pascal `StartOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/startoftheweek.html)

<small>Created 2026-07-15</small>
