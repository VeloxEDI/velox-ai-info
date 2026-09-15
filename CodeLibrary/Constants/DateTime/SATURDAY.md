---
title: SATURDAY
description: "Represents Saturday as 6 in Velox's Monday-first weekday numbering."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, saturday, weekday, iso]
---

```Delphi
SATURDAY = 6
```

### Example

```Delphi
function IsSaturday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = SATURDAY;
end;
```

### Usage

Represents Saturday as 6 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `SATURDAY` as a signed `LongInt`. It is value 6 in the Monday-first sequence and matches [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) returns `7` for Saturday. Mixing the functions silently classifies the adjacent day because both use valid values 1..7.

The constant does not define whether Saturday is a working day, weekend, holiday or cutoff day. Those are configuration/business-calendar rules. The example is source-reviewed only; no date or business calendar was evaluated.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday-first numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
