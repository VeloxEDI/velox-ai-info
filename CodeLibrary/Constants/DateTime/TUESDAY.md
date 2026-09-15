---
title: TUESDAY
description: "Represents Tuesday as 2 in Velox's Monday-first weekday numbering."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tuesday, weekday, iso]
---

```Delphi
TUESDAY = 2
```

### Example

```Delphi
function IsTuesday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = TUESDAY;
end;
```

### Usage

Represents Tuesday as 2 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `TUESDAY` as a signed `LongInt`. It is value 2 in the Monday-first sequence and matches [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) returns `3` for Tuesday. A generic numeric weekday field must state which convention it uses before this constant is applied.

The value contains no timezone or locale. The date function evaluates the calendar date already encoded in the input; converting an instant between timezones can change that date and therefore its weekday. The example is source-reviewed only and was not executed.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday-first numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
