---
title: FRIDAY
description: "Represents Friday as 5 in Velox's Monday-first weekday numbering."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, friday, weekday, iso]
---

```Delphi
FRIDAY = 5
```

### Example

```Delphi
function IsFriday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = FRIDAY;
end;
```

### Usage

Represents Friday as 5 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `FRIDAY` as a signed `LongInt`. It belongs to the fixed Monday-first sequence Monday=1 through Sunday=7 and matches [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md).

Do not compare it directly with SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md): that function represents Friday as `6` because its sequence starts with Sunday=1. Both results are in 1..7, so a mismatch will not produce a range error.

The constant contains no date, timezone or locale. `DayOfTheWeek` evaluates the date as encoded without converting local/UTC basis. The example is source-reviewed only; no weekday calculation was executed.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - Monday-first weekday numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
