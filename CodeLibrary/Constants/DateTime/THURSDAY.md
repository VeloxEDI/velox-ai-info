---
title: THURSDAY
description: "Represents Thursday as 4 in Velox's Monday-first weekday numbering."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, thursday, weekday, iso]
---

```Delphi
THURSDAY = 4
```

### Example

```Delphi
function IsThursday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = THURSDAY;
end;
```

### Usage

Represents Thursday as 4 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `THURSDAY` as a signed `LongInt`. It is value 4 in the fixed Monday-first sequence used by [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) returns `5` for Thursday. Use a conversion or the matching constants when a partner/configuration uses Sunday-first numbering.

ISO week-numbering years use the week containing Thursday to determine week-year membership, but this constant alone does not calculate a week number or week-year. Use the documented Decode/WeekOf functions. The example is source-reviewed only; no date was evaluated.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday-first numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
