---
title: "TryEncodeDateWeek"
description: "Tries to construct midnight from an ISO week-year, week number and weekday."
sidebar_position: 150
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - week-date
  - validation
---

```Delphi
Function TryEncodeDateWeek(const AYear, AWeekOfYear: Word;
  var AValue: TDateTime; const ADayOfWeek: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedDate: TDateTime;
begin
  if TryEncodeDateWeek(2026, 1, EncodedDate, 1) then
    Value := EncodedDate; // Monday 29 December 2025
end;
```

### Usage

`TryEncodeDateWeek` tries to construct midnight from an ISO week-year, week number and weekday.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-numbering year `1..9999`. |
| `AWeekOfYear` | `Word`, `const` | Week `1..52`, or week 53 when the ISO year has it. |
| `AValue` | `TDateTime`, `var` | Receives the selected date at midnight on success. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`; required by the Velox declaration. |

**Returns**

`True` for a valid ISO week-year/week/weekday triplet; otherwise `False`.

**Errors**

Expected range/ISO-combination failures return `False`; the normal path does not raise.

### Additional Technical Info
`TryEncodeDateWeek` converts an ISO 8601 week-numbering year, week and Monday-based weekday into midnight. ISO week 1 contains the year's first Thursday, so the returned calendar year can differ from `AYear`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryEncodeDateWeek`. It calls `IsValidDateWeek`, encodes 1 January, determines that date's ISO weekday and applies an offset that assigns the opening partial week to the correct ISO year.

**Edge cases and quirks**

- `AYear` is the ISO week year, not necessarily the result's Gregorian calendar year.
- Week 53 is accepted only for an ISO year in which `WeeksInAYear` returns 53.
- Weekdays use Monday `1`; this differs from `DayOfWeek`, where Sunday is `1`.
- The underlying Delphi/Free Pascal APIs can provide a default Monday argument, but the generated Velox declaration requires `ADayOfWeek` explicitly.
- `AValue` is assigned only after validation succeeds. Ignore it when the function returns `False`.

**Side effects**

Writes `AValue` on success only. No shared state or I/O.

**Performance and concurrency**

Constant bounded calendar arithmetic with no shared mutable state.

**Related entries**

- [`EncodeDateWeek`](EncodeDateWeek.md) raises for invalid ISO fields.
- [`DecodeDateWeek`](DecodeDateWeek.md) performs the inverse decomposition.
- [`WeeksInAYear`](WeeksInAYear.md) determines whether week 53 exists.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDateWeek)
- [Free Pascal `TryEncodeDateWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedateweek.html) - the upstream overload/default list is broader than Velox's explicit declaration.

<small>Created 2026-07-15</small>
