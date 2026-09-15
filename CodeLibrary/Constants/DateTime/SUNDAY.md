---
title: SUNDAY
description: "Represents Sunday as 7 in Velox's Monday-first weekday numbering."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, sunday, weekday, iso]
---

```Delphi
SUNDAY = 7
```

### Example

```Delphi
function IsSunday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = SUNDAY;
end;
```

### Usage

Represents Sunday as 7 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `SUNDAY` as a signed `LongInt`. It closes the Monday-first sequence and matches [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

This is the most obvious numbering trap: SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) returns `1` for Sunday. Comparing that result to `SUNDAY` is always wrong even though both values are individually valid weekday numbers.

The constant does not define week boundaries for reporting, fiscal periods or locale display. State the numbering convention at every external/configuration boundary. The example is source-reviewed only; no weekday calculation was executed.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday=1 through Sunday=7.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
