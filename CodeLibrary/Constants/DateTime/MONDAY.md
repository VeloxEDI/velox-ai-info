---
title: MONDAY
description: "Represents Monday as 1 in Velox's Monday-first weekday numbering."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, monday, weekday, iso]
---

```Delphi
MONDAY = 1
```

### Example

```Delphi
function IsMonday(const Value: TDateTime): Boolean;
begin
  Result := DayOfTheWeek(Value) = MONDAY;
end;
```

### Usage

Represents Monday as 1 in Velox's Monday-first weekday numbering.

### Additional Technical Info
The Velox date-tools importer registers `MONDAY` as a signed `LongInt`. It begins the fixed Monday-first sequence used by [`DayOfTheWeek`](../../Functions/DateTime/DayOfTheWeek.md) and ISO-style weekday fields.

SysUtils [`DayOfWeek`](../../Functions/DateTime/DayOfWeek.md) instead represents Monday as `2`, because it begins with Sunday=1. Use the constant only with a field/function whose numbering contract is Monday-first; never infer compatibility merely from a 1..7 range.

The value is independent of locale preferences about the first displayed day of a calendar. The source date retains its existing local/UTC interpretation. The example is source-reviewed only; no weekday calculation was executed.

**External references**

- [Embarcadero DayOfTheWeek](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - exact Monday-first numbering.
- [Free Pascal DayOfTheWeek](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - compatible numbering.

<small>Created 2026-07-15</small>
