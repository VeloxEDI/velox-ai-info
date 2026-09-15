---
title: WEDNESDAY
description: "Represents Wednesday as 3 in Velox's Monday-first weekday numbering."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, wednesday, weekday, iso]
---

```Delphi
WEDNESDAY = 3
```

### Example

```Delphi
function IsWednesday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = WEDNESDAY;
end;
```

### Usage

Represents Wednesday as 3 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `WEDNESDAY` as a signed `LongInt`. It is value 3 in the Monday-first sequence used by [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) represents Wednesday as `4`. The numeric values require an explicit convention at database, JSON, EDI and configuration boundaries.

The constant does not identify a particular calendar date or business day. Holiday and cutoff rules remain external configuration. The example is source-reviewed only; no weekday or calendar rule was evaluated.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday-first numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
