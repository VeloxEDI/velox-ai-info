---
title: "EncodeDateWeek"
description: "Encodes an ISO week-numbering year, week and Monday-based weekday as a midnight TDateTime value."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - week-date
  - weekday
---

```Delphi
Function EncodeDateWeek(const AYear, AWeekOfYear: Word;
  const ADayOfWeek: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Monday of ISO week 1 in 2026 is 29 December 2025.
  Value := EncodeDateWeek(2026, 1, 1);
end;
```

### Usage

`EncodeDateWeek` encodes an ISO week-numbering year, week and Monday-based weekday as a midnight TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-numbering year `1..9999`, which can differ from the result's calendar year near New Year. |
| `AWeekOfYear` | `Word`, `const` | ISO week `1..52`, or `1..53` for an ISO year that contains week 53. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`. The script declaration requires this argument. |

**Returns**

The selected ISO weekday at `00:00:00.000` as a `TDateTime`.

**Errors**

An invalid year, unavailable week number or weekday outside `1..7` raises `EConvertError`.

### Additional Technical Info
`EncodeDateWeek` converts ISO 8601 week-date fields to a calendar date. ISO weeks begin on Monday; week 1 is the week containing the year's first Thursday, so a result can lie in the preceding or following calendar year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EncodeDateWeek`. Validation calls `WeeksInAYear` and checks the weekday. The implementation encodes 1 January of `AYear`, obtains its ISO weekday, then adds an offset for the requested week/day adjusted by whether the year's opening days belong to the previous ISO year.

**Edge cases and quirks**

- `AYear` is an ISO week year, not necessarily the calendar year returned. Early January can belong to the prior ISO year; late December can belong to the next one.
- Week 53 is valid only when that ISO year actually has 53 weeks.
- Unlike the underlying Delphi declaration's default weekday of Monday, the generated Velox script declaration exposes no default; supply `ADayOfWeek` explicitly.
- Weekdays use Monday `1`, unlike `DayOfWeek`, which uses Sunday `1`.
- The returned value is timezone-neutral and at midnight.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no allocation or shared state.

**Related entries**

- [`DecodeDateWeek`](DecodeDateWeek.md) converts a date back to ISO week fields.
- [`DayOfTheWeek`](DayOfTheWeek.md) uses the same Monday-based weekday numbering.

**External references**

- [Embarcadero `System.DateUtils.EncodeDateWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EncodeDateWeek)
- [Free Pascal `EncodeDateWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/encodedateweek.html) - the public Free Pascal page also lists a two-argument overload; Velox exposes only the explicit three-argument declaration.

<small>Created 2026-07-15</small>
