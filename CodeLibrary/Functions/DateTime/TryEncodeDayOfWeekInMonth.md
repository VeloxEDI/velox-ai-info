---
title: "TryEncodeDayOfWeekInMonth"
description: "Tries to encode the nth ISO weekday occurrence in a supplied calendar month."
sidebar_position: 151
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - occurrence
  - validation
---

```Delphi
Function TryEncodeDayOfWeekInMonth(const AYear, AMonth, ANthDayOfWeek,
  ADayOfWeek: Word; var AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedDate: TDateTime;
begin
  if TryEncodeDayOfWeekInMonth(2026, 7, 3, 5, EncodedDate) then
    Value := EncodedDate; // Third Friday: 17 July
end;
```

### Usage

`TryEncodeDayOfWeekInMonth` tries to encode the nth ISO weekday occurrence in a supplied calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year; use `1..9999`. |
| `AMonth` | `Word`, `const` | Month; use `1..12`. |
| `ANthDayOfWeek` | `Word`, `const` | Occurrence; use `1..5`. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`. |
| `AValue` | `TDateTime`, `var` | Receives the calculated midnight only if the final date encodes. |

**Returns**

Normally `True` when the calculated occurrence is an encodable day in the requested month and `False` otherwise. See the validation gaps below.

**Errors**

Invalid year/month can raise `EConvertError`. A non-existent calculated day normally returns `False`. Out-of-range occurrence/weekday inputs have unreliable calculated outcomes and must not be used as validation probes.

### Additional Technical Info
`TryEncodeDayOfWeekInMonth` calculates the literal nth occurrence of a Monday-based weekday within a Gregorian month. It is intended to return `False` when the calculated occurrence does not encode, but its installed implementation has important validation and exception gaps.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryEncodeDayOfWeekInMonth`. The terminal calls `StartOfAMonth`, obtains the first day's ISO weekday, calculates a day number from the two occurrence fields, then calls `System.SysUtils.TryEncodeDate`. It does not first call a dedicated range validator.

**Edge cases and quirks**

- An invalid `AYear` or `AMonth` can raise from `StartOfAMonth` **despite the `Try` name**. This routine is not exception-free.
- `ANthDayOfWeek` and `ADayOfWeek` are not explicitly constrained before arithmetic. Some out-of-range combinations can calculate an otherwise valid day and return `True`; others return `False`. Validate `1..5` and `1..7` yourself.
- A requested fifth occurrence returns `False` when the calculated day lies beyond that month.
- This is a literal occurrence, not the ISO four-day month-week ownership model used by `TryEncodeDateMonthWeek`.
- `AValue` is assigned only if the final `TryEncodeDate` succeeds.

**Side effects**

May write `AValue`; no external state changes.

**Performance and concurrency**

Constant bounded arithmetic with no shared mutable state.

**Related entries**

- [`EncodeDayOfWeekInMonth`](EncodeDayOfWeekInMonth.md) wraps this routine and raises on a `False` result.
- [`TryEncodeDateMonthWeek`](TryEncodeDateMonthWeek.md) uses ISO month-week ownership instead.
- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) extracts the literal occurrence.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDayOfWeekInMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDayOfWeekInMonth)
- [Free Pascal `TryEncodeDayOfWeekInMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedayofweekinmonth.html) - compatibility documentation does not prove the installed Delphi validation gaps.

<small>Created 2026-07-15</small>
